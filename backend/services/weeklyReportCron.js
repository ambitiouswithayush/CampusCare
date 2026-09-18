const cron = require('node-cron');
const User = require('../models/User');
const { generateWeeklyReport } = require('./wellnessReport');
const { getIO } = require('../socket');

// Every Sunday at 9:00 AM server time, auto-generate a report for every
// student who logged at least one mood in the last 7 days.
const scheduleWeeklyReports = () => {
  cron.schedule('0 9 * * 0', async () => {
    console.log('[weeklyReportCron] Generating weekly wellness reports...');
    const students = await User.find({ role: 'student' });

    for (const student of students) {
      try {
        const report = await generateWeeklyReport(student);
        try {
          getIO().to(`user:${student._id}`).emit('report:ready', {
            reportId: report._id,
            fileUrl: report.fileUrl,
          });
        } catch (e) {}
      } catch (error) {
        console.error(`[weeklyReportCron] Failed for ${student.email}:`, error.message);
      }
    }
    console.log('[weeklyReportCron] Done.');
  });
};

module.exports = { scheduleWeeklyReports };
