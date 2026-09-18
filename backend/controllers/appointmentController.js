const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { getIO } = require('../socket');
const { notifyUser } = require('../utils/notify');

// Maps a free-text "what's this about" concern to the specialization tags
// stored on doctor accounts. Simple rule-based lookup - no ML needed.
const CONCERN_TO_SPECIALIZATION = {
  anxiety: ['anxiety', 'stress'],
  stress: ['stress', 'anxiety', 'academic'],
  depression: ['depression'],
  career: ['career'],
  relationships: ['relationships'],
  academic: ['academic', 'stress'],
  general: ['general'],
};

// @desc    Recommend a counselor based on concern type, availability, and
//          whether the student has seen them before (continuity of care).
// @route   GET /api/appointments/recommend?concern=anxiety
// @access  Private (Student)
exports.recommendDoctors = async (req, res) => {
  try {
    const concern = (req.query.concern || 'general').toLowerCase();
    const wantedTags = CONCERN_TO_SPECIALIZATION[concern] || ['general'];

    const allDoctors = await User.find({ role: 'doctor' }).select('name email specialization');

    if (allDoctors.length === 0) {
      return res.json({ success: true, concern, recommendations: [] });
    }

    // Past sessions with this student, to reward continuity of care
    const pastAppointments = await Appointment.find({
      student: req.user._id,
      status: { $in: ['approved', 'completed'] },
    }).select('doctor');
    const seenDoctorIds = new Set(pastAppointments.map((a) => a.doctor.toString()));

    // Current caseload per doctor, as a simple availability proxy
    const caseloadCounts = await Appointment.aggregate([
      { $match: { status: { $in: ['pending', 'approved'] } } },
      { $group: { _id: '$doctor', count: { $sum: 1 } } },
    ]);
    const caseloadByDoctor = Object.fromEntries(
      caseloadCounts.map((c) => [c._id.toString(), c.count])
    );

    const scored = allDoctors.map((doctor) => {
      const specialization = doctor.specialization || [];
      const matchesConcern = specialization.some((tag) => wantedTags.includes(tag));
      const seenBefore = seenDoctorIds.has(doctor._id.toString());
      const caseload = caseloadByDoctor[doctor._id.toString()] || 0;

      // Rule-based score: specialization match matters most, then continuity,
      // then lighter caseload. Weights are simple and easy to explain in a demo.
      let score = 0;
      const reasons = [];
      if (matchesConcern) {
        score += 50;
        reasons.push(`Specializes in ${concern}`);
      }
      if (seenBefore) {
        score += 20;
        reasons.push("You've had a session with them before");
      }
      score += Math.max(0, 10 - caseload); // lighter caseload -> higher score
      reasons.push(caseload === 0 ? 'Fully available right now' : `${caseload} pending/upcoming session(s)`);

      return {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization,
        score,
        reasons,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      concern,
      recommendations: scored,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Student books appointment
// @route POST /api/appointments
// @access Student
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    const appointment = await Appointment.create({
      student: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason: reason || '',
    });

    await appointment.populate('student', 'name email');

    getIO().to(`user:${doctorId}`).emit('appointment:new', {
      appointment,
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Doctor views appointments
// @route GET /api/appointments/doctor
// @access Doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('student', 'name email');

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Student views own appointments
// @route GET /api/appointments/student
// @access Student
exports.getStudentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user._id })
      .populate('doctor', 'name email');

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Doctor - view own appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    }).populate('student', 'name email');

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Doctor updates appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Doctor)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allow only valid status values
    if (!['approved', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Ensure doctor owns this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
    }

    appointment.status = status;
    await appointment.save();

    getIO().to(`user:${appointment.student}`).emit('appointment:updated', {
      appointmentId: appointment._id,
      status: appointment.status,
      date: appointment.date,
      time: appointment.time,
    });

    notifyUser(appointment.student, {
      type: 'appointment',
      title: 'Appointment update',
      message: `Your appointment on ${appointment.date} at ${appointment.time} is now ${appointment.status}.`,
      link: '/appointments',
    }).catch((err) => console.error('Notification failed:', err.message));

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
