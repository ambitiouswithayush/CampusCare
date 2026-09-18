const nodemailer = require('nodemailer');

// Lazily built so a missing SMTP config doesn't crash the app at require-time.
let transporter = null;
const isConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (!transporter && isConfigured()) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

// Sends an email if SMTP is configured; otherwise logs to console so the
// crisis pipeline still "fires" visibly during a demo without real SMTP creds.
const sendMail = async ({ to, subject, text, html }) => {
  if (!isConfigured()) {
    console.warn(
      `[mailer] SMTP not configured - would have emailed "${subject}" to ${to}. ` +
      'Set SMTP_HOST/SMTP_USER/SMTP_PASS in backend/.env to actually send it.'
    );
    return { sent: false, reason: 'not_configured' };
  }

  try {
    await getTransporter().sendMail({
      from: process.env.ALERT_FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error('[mailer] Failed to send email:', error.message);
    return { sent: false, reason: error.message };
  }
};

module.exports = { sendMail };
