const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  logMood,
  getMoodHistory,
  getMoodStats,
  getMoodInsights,
  trackAction,
} = require('../controllers/moodController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Log a mood
router.post('/', logMood);

// Get mood history
router.get('/history', getMoodHistory);

// Get mood statistics
router.get('/stats', getMoodStats);

// Get mood insights
router.get('/insights', getMoodInsights);

// Track action taken from suggestion
router.post('/track-action', trackAction);

module.exports = router;
