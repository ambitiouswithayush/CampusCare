const Mood = require('../models/Mood');

// Log a mood
exports.logMood = async (req, res) => {
  try {
    const { mood, emoji, note } = req.body;

    if (!mood || !emoji) {
      return res.status(400).json({
        success: false,
        message: 'Mood and emoji are required',
      });
    }

    const moodEntry = await Mood.create({
      user: req.user._id,
      mood,
      emoji,
      note: note || '',
      triggeredActions: [],
    });

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      mood: moodEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging mood',
      error: error.message,
    });
  }
};

// Get user's mood history
exports.getMoodHistory = async (req, res) => {
  try {
    const { limit = 30, days = 30 } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const moods = await Mood.find({
      user: req.user._id,
      createdAt: { $gte: daysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: moods.length,
      moods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood history',
      error: error.message,
    });
  }
};

// Get mood statistics for user
exports.getMoodStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Count by mood type
    const moodCounts = await Mood.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get total count
    const totalMoods = moodCounts.reduce((sum, m) => sum + m.count, 0);

    // Format as percentages
    const stats = moodCounts.map((m) => ({
      mood: m._id,
      count: m.count,
      percentage: totalMoods > 0 ? ((m.count / totalMoods) * 100).toFixed(1) : 0,
    }));

    // Get most common mood
    const mostCommon = moodCounts.sort((a, b) => b.count - a.count)[0];

    res.json({
      success: true,
      period: `Last ${days} days`,
      totalEntries: totalMoods,
      breakdown: stats,
      mostCommon: mostCommon ? mostCommon._id : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood stats',
      error: error.message,
    });
  }
};

// Get mood insights (patterns, suggestions)
exports.getMoodInsights = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moods = await Mood.find({
      user: req.user._id,
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: 1 });

    const insights = [];

    // Insight 1: Mood frequency
    const moodCounts = {};
    moods.forEach((m) => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

    if (sortedMoods.length > 0) {
      const topMood = sortedMoods[0];
      insights.push({
        type: 'frequency',
        message: `You've felt ${topMood[0]} most often this month (${topMood[1]} times).`,
        suggestion: getMoodSuggestion(topMood[0]),
      });
    }

    // Insight 2: Day of week patterns
    const dayPattern = {};
    moods.forEach((m) => {
      const day = new Date(m.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayPattern[day]) dayPattern[day] = {};
      dayPattern[day][m.mood] = (dayPattern[day][m.mood] || 0) + 1;
    });

    // Find day with most anxious/down moods
    let worstDay = null;
    let worstCount = 0;
    Object.entries(dayPattern).forEach(([day, moods]) => {
      const negativeCount = (moods.Anxious || 0) + (moods.Down || 0);
      if (negativeCount > worstCount) {
        worstCount = negativeCount;
        worstDay = day;
      }
    });

    if (worstDay && worstCount > 1) {
      insights.push({
        type: 'pattern',
        message: `You tend to feel stressed or down on ${worstDay}s.`,
        suggestion: `Consider scheduling self-care activities on ${worstDay}s, or talk to a counselor about managing ${worstDay} stress.`,
      });
    }

    // Insight 3: Recent trend
    if (moods.length >= 7) {
      const lastWeek = moods.slice(-7);
      const positiveCount = lastWeek.filter((m) => m.mood === 'Great').length;
      const negativeCount = lastWeek.filter((m) => m.mood === 'Anxious' || m.mood === 'Down').length;

      if (positiveCount >= 5) {
        insights.push({
          type: 'trend',
          message: 'You\'ve been feeling great lately! Keep it up! 🎉',
          suggestion: 'Share your positive habits with others in the Common Room.',
        });
      } else if (negativeCount >= 5) {
        insights.push({
          type: 'trend',
          message: 'You\'ve been struggling this week. Remember, it\'s okay to ask for help.',
          suggestion: 'Consider booking a counselor appointment or chatting with our AI companion.',
        });
      }
    }

    res.json({
      success: true,
      totalMoods: moods.length,
      insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating insights',
      error: error.message,
    });
  }
};

// Helper function
function getMoodSuggestion(mood) {
  const suggestions = {
    Great: 'Keep up the positive momentum! Consider sharing your wellness tips with others.',
    Okay: 'You\'re doing well. Try exploring new wellness resources to feel even better.',
    Down: 'It\'s okay to feel down sometimes. Consider talking to someone or trying a guided meditation.',
    Anxious: 'Anxiety is manageable. Try breathing exercises, chat with our AI, or book a counselor session.',
  };
  return suggestions[mood] || 'Keep taking care of yourself!';
}

// Track action taken from suggestion
exports.trackAction = async (req, res) => {
  try {
    const { moodId, action } = req.body;

    const mood = await Mood.findOne({
      _id: moodId,
      user: req.user._id,
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found',
      });
    }

    mood.triggeredActions.push(action);
    await mood.save();

    res.json({
      success: true,
      message: 'Action tracked',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking action',
      error: error.message,
    });
  }
};
