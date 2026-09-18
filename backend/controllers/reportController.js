const WellnessReport = require('../models/WellnessReport');
const { generateWeeklyReport } = require('../services/wellnessReport');

// @desc    Generate a wellness report for the logged-in student right now
// @route   POST /api/reports/generate
// @access  Private (Student)
exports.generateMyReport = async (req, res) => {
  try {
    const report = await generateWeeklyReport(req.user);
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating report', error: error.message });
  }
};

// @desc    List the logged-in student's past reports
// @route   GET /api/reports
// @access  Private (Student)
exports.getMyReports = async (req, res) => {
  try {
    const reports = await WellnessReport.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
