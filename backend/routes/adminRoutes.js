const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const {
  chatInsights,
  peakUsage,
  forumActivity,
  appointmentTrends,
  dashboardOverview,
  moodAnalytics,
} = require('../controllers/adminController');

const router = express.Router();

// ==========================================
// ADMIN ANALYTICS ROUTES
// ==========================================
// 🔐 All routes require:
// 1. Authentication (protect middleware)
// 2. Admin role (isAdmin middleware)

// Dashboard Overview - All stats at once
router.get('/overview', protect, isAdmin, dashboardOverview);

// Chat Insights - Mental health trends from AI chat
router.get('/chat-insights', protect, isAdmin, chatInsights);

// Peak Usage - When students are most active
router.get('/peak-usage', protect, isAdmin, peakUsage);

// Forum Activity - Peer support engagement
router.get('/forum-activity', protect, isAdmin, forumActivity);

// Appointment Trends - Counseling demand
router.get('/appointment-trends', protect, isAdmin, appointmentTrends);

// Mood Analytics - Student wellness trends
router.get('/mood-analytics', protect, isAdmin, moodAnalytics);

module.exports = router;
