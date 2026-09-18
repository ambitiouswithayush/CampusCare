const Mood = require('../models/Mood');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const CrisisAlert = require('../models/CrisisAlert');
const { sendMail } = require('../utils/mailer');
const { getIO } = require('../socket');
const { notifyUser } = require('../utils/notify');

// Mood type doesn't carry a numeric intensity in the UI (yet), so we estimate
// one when the student didn't set one explicitly. Keeps the "intensity >= 8"
// rule meaningful even for old/simple mood entries.
const MOOD_INTENSITY_ESTIMATE = { Great: 2, Okay: 4, Down: 7, Anxious: 9 };
const CRISIS_MOOD_STREAK_LENGTH = 5;
const CRISIS_INTENSITY_THRESHOLD = 8;

const effectiveIntensity = (moodDoc) =>
  typeof moodDoc.intensity === 'number' ? moodDoc.intensity : MOOD_INTENSITY_ESTIMATE[moodDoc.mood] ?? 5;

// Finds the counselor best positioned to be notified: whoever the student
// most recently had an appointment with, else a configured fallback inbox.
const resolveNotifyTarget = async (studentId) => {
  const lastAppointment = await Appointment.findOne({ student: studentId })
    .sort({ createdAt: -1 })
    .populate('doctor', 'name email');

  if (lastAppointment?.doctor) {
    return { doctorId: lastAppointment.doctor._id, email: lastAppointment.doctor.email, name: lastAppointment.doctor.name };
  }

  if (process.env.COUNSELOR_ALERT_EMAIL) {
    return { doctorId: null, email: process.env.COUNSELOR_ALERT_EMAIL, name: 'Counseling Team' };
  }

  return null;
};

// Avoids spamming the same alert every time a trigger condition re-fires.
const hasRecentAlert = async (studentId, type, withinHours = 24) => {
  const since = new Date(Date.now() - withinHours * 60 * 60 * 1000);
  const existing = await CrisisAlert.findOne({ student: studentId, type, createdAt: { $gte: since } });
  return !!existing;
};

const raiseAlert = async ({ studentId, type, details }) => {
  if (await hasRecentAlert(studentId, type)) return null;

  const student = await User.findById(studentId).select('name email');
  const target = await resolveNotifyTarget(studentId);

  const alert = await CrisisAlert.create({
    student: studentId,
    type,
    details,
    notifiedDoctor: target?.doctorId || undefined,
  });

  // 1. Flag in admin dashboard (red alert), live
  try {
    getIO().to('role:admin').emit('crisis:alert', {
      alertId: alert._id,
      studentName: student?.name,
      type,
      details,
      createdAt: alert.createdAt,
    });
  } catch (e) {
    // Socket may not be initialized in a script/test context - not fatal.
  }

  // 2. Show the crisis helpline prominently to the student, live
  try {
    getIO().to(`user:${studentId}`).emit('crisis:self', {
      message: 'We noticed you might be going through a difficult time.',
    });
  } catch (e) {}

  notifyUser(studentId, {
    type: 'crisis',
    title: 'We noticed you might be going through a difficult time',
    message: 'Crisis helpline: AASRA 91-9820466726 • Kiran (Govt.) 1800-599-0019. Consider booking a counselor session.',
    link: '/appointments',
  }).catch((err) => console.error('Notification failed:', err.message));

  // 3. Email the counselor
  if (target?.email) {
    await sendMail({
      to: target.email,
      subject: `Crisis alert: ${student?.name || 'A student'} may need support`,
      text: `${student?.name || 'A student'} (${student?.email}) has triggered a crisis alert.\n\nType: ${type}\nDetails: ${details}\n\nPlease review and reach out.`,
    });
  }

  return alert;
};

// Trigger 1: sustained high-intensity mood over consecutive days
const checkMoodStreak = async (studentId) => {
  const recentMoods = await Mood.find({ user: studentId })
    .sort({ createdAt: -1 })
    .limit(CRISIS_MOOD_STREAK_LENGTH);

  if (recentMoods.length < CRISIS_MOOD_STREAK_LENGTH) return null;

  const allHighIntensity = recentMoods.every((m) => effectiveIntensity(m) >= CRISIS_INTENSITY_THRESHOLD);
  if (!allHighIntensity) return null;

  return raiseAlert({
    studentId,
    type: 'mood_streak',
    details: `Mood intensity has stayed at ${CRISIS_INTENSITY_THRESHOLD}+ for the last ${CRISIS_MOOD_STREAK_LENGTH} check-ins.`,
  });
};

// Trigger 2: specific high-risk language in chat
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self harm', 'hurt myself',
  'worthless', 'no point', "can't go on", 'want to die',
];

const detectCrisisKeyword = (message) => {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.find((keyword) => lower.includes(keyword)) || null;
};

const flagChatKeyword = async (studentId, keyword, message) =>
  raiseAlert({
    studentId,
    type: 'chat_keyword',
    details: `Message contained the phrase "${keyword}": "${message.slice(0, 200)}"`,
  });

module.exports = { checkMoodStreak, detectCrisisKeyword, flagChatKeyword, CRISIS_KEYWORDS };
