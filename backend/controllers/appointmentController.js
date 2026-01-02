const Appointment = require('../models/Appointment');

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
