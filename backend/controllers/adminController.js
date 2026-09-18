const ChatMessage = require('../models/ChatMessage');
const Post = require('../models/post');
const Appointment = require('../models/Appointment');
const Mood = require('../models/Mood');
const CrisisAlert = require('../models/CrisisAlert');
const User = require('../models/User');
const { notifyUsers } = require('../utils/notify');

// ==========================================
// ADMIN ANALYTICS CONTROLLER
// ==========================================
// 🔐 ALL endpoints return ONLY anonymous, aggregated data
// ❌ NO user names, emails, or identifiable information

// ==========================================
// 1. CHAT INSIGHTS - Mental Health Trends
// ==========================================
exports.chatInsights = async (req, res) => {
  try {
    // Count total user messages (exclude AI assistant messages)
    const totalChats = await ChatMessage.countDocuments({ role: 'user' });

    if (totalChats === 0) {
      return res.json({
        success: true,
        insights: {
          totalChats: 0,
          message: 'No chat data available yet',
        },
      });
    }

    // Count messages mentioning specific concerns (case-insensitive)
    const examStress = await ChatMessage.countDocuments({
      role: 'user',
      message: /exam|test|pressure|study|grade|assessment/i,
    });

    const sleepIssues = await ChatMessage.countDocuments({
      role: 'user',
      message: /sleep|insomnia|tired|fatigue|rest/i,
    });

    const anxietyStress = await ChatMessage.countDocuments({
      role: 'user',
      message: /anxious|anxiety|stress|worried|panic|nervous/i,
    });

    const loneliness = await ChatMessage.countDocuments({
      role: 'user',
      message: /lonely|alone|isolated|friend|social/i,
    });

    const depression = await ChatMessage.countDocuments({
      role: 'user',
      message: /depress|sad|hopeless|unmotivated|down/i,
    });

    res.json({
      success: true,
      insights: {
        totalChats,
        concerns: {
          examStress: {
            count: examStress,
            percentage: ((examStress / totalChats) * 100).toFixed(1),
          },
          sleepIssues: {
            count: sleepIssues,
            percentage: ((sleepIssues / totalChats) * 100).toFixed(1),
          },
          anxietyStress: {
            count: anxietyStress,
            percentage: ((anxietyStress / totalChats) * 100).toFixed(1),
          },
          loneliness: {
            count: loneliness,
            percentage: ((loneliness / totalChats) * 100).toFixed(1),
          },
          depression: {
            count: depression,
            percentage: ((depression / totalChats) * 100).toFixed(1),
          },
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat insights',
      error: error.message,
    });
  }
};

// ==========================================
// 2. PEAK USAGE TIME - When students seek help
// ==========================================
exports.peakUsage = async (req, res) => {
  try {
    // Aggregate chat messages by hour of the day
    const chatData = await ChatMessage.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by hour (0-23)
    ]);

    // Aggregate forum posts by hour
    const forumData = await Post.aggregate([
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format data for frontend
    const chatByHour = chatData.map((item) => ({
      hour: item._id,
      count: item.count,
      timeLabel: `${item._id}:00 - ${item._id}:59`,
    }));

    const forumByHour = forumData.map((item) => ({
      hour: item._id,
      count: item.count,
      timeLabel: `${item._id}:00 - ${item._id}:59`,
    }));

    // Find peak hours
    const peakChatHour = chatData.length > 0
      ? chatData.reduce((max, item) => (item.count > max.count ? item : max))
      : null;

    const peakForumHour = forumData.length > 0
      ? forumData.reduce((max, item) => (item.count > max.count ? item : max))
      : null;

    res.json({
      success: true,
      peakUsage: {
        chat: {
          hourlyDistribution: chatByHour,
          peakHour: peakChatHour
            ? {
                hour: peakChatHour._id,
                count: peakChatHour.count,
                timeLabel: `${peakChatHour._id}:00 - ${peakChatHour._id}:59`,
              }
            : null,
        },
        forum: {
          hourlyDistribution: forumByHour,
          peakHour: peakForumHour
            ? {
                hour: peakForumHour._id,
                count: peakForumHour.count,
                timeLabel: `${peakForumHour._id}:00 - ${peakForumHour._id}:59`,
              }
            : null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching peak usage data',
      error: error.message,
    });
  }
};

// ==========================================
// 3. FORUM ACTIVITY - Peer support engagement
// ==========================================
exports.forumActivity = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const anonymousPosts = await Post.countDocuments({ anonymous: true });

    // Count total replies across all posts
    const replyStats = await Post.aggregate([
      {
        $project: {
          replyCount: { $size: '$replies' },
        },
      },
      {
        $group: {
          _id: null,
          totalReplies: { $sum: '$replyCount' },
          avgRepliesPerPost: { $avg: '$replyCount' },
        },
      },
    ]);

    const totalReplies = replyStats.length > 0 ? replyStats[0].totalReplies : 0;
    const avgReplies = replyStats.length > 0 ? replyStats[0].avgRepliesPerPost.toFixed(1) : 0;

    // Get posts created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentPosts = await Post.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      forumActivity: {
        totalPosts,
        totalReplies,
        avgRepliesPerPost: avgReplies,
        anonymousPostsPercentage: totalPosts > 0
          ? ((anonymousPosts / totalPosts) * 100).toFixed(1)
          : 0,
        recentActivity: {
          postsLast7Days: recentPosts,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forum activity',
      error: error.message,
    });
  }
};

// ==========================================
// 4. APPOINTMENT TRENDS - Counseling demand
// ==========================================
exports.appointmentTrends = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();

    // Count by status
    const pending = await Appointment.countDocuments({ status: 'pending' });
    const approved = await Appointment.countDocuments({ status: 'approved' });
    const rejected = await Appointment.countDocuments({ status: 'rejected' });

    // Appointments in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Most common reasons (analyze reason field)
    const reasonStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$reason',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 }, // Top 5 reasons
    ]);

    res.json({
      success: true,
      appointmentTrends: {
        total: totalAppointments,
        byStatus: {
          pending,
          approved,
          rejected,
        },
        statusPercentages: {
          pendingPercent: totalAppointments > 0
            ? ((pending / totalAppointments) * 100).toFixed(1)
            : 0,
          approvedPercent: totalAppointments > 0
            ? ((approved / totalAppointments) * 100).toFixed(1)
            : 0,
          rejectedPercent: totalAppointments > 0
            ? ((rejected / totalAppointments) * 100).toFixed(1)
            : 0,
        },
        recentActivity: {
          appointmentsLast30Days: recentAppointments,
        },
        topReasons: reasonStats.map((item, index) => ({
          rank: index + 1,
          reason: item._id,
          count: item.count,
          percentage: totalAppointments > 0
            ? ((item.count / totalAppointments) * 100).toFixed(1)
            : 0,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment trends',
      error: error.message,
    });
  }
};

// ==========================================
// 5. DASHBOARD OVERVIEW - All stats at once
// ==========================================
exports.dashboardOverview = async (req, res) => {
  try {
    // Total counts
    const totalChats = await ChatMessage.countDocuments({ role: 'user' });
    const totalPosts = await Post.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentChats = await ChatMessage.countDocuments({
      role: 'user',
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentPosts = await Post.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Top concern from chats
    const topConcerns = [];
    if (totalChats > 0) {
      const concerns = [
        {
          name: 'Exam Stress',
          count: await ChatMessage.countDocuments({
            role: 'user',
            message: /exam|test|pressure|study|grade/i,
          }),
        },
        {
          name: 'Sleep Issues',
          count: await ChatMessage.countDocuments({
            role: 'user',
            message: /sleep|insomnia|tired|fatigue/i,
          }),
        },
        {
          name: 'Anxiety',
          count: await ChatMessage.countDocuments({
            role: 'user',
            message: /anxious|anxiety|stress|worried|panic/i,
          }),
        },
      ];

      concerns.sort((a, b) => b.count - a.count);
      topConcerns.push(...concerns.slice(0, 3));
    }

    res.json({
      success: true,
      overview: {
        totalEngagement: {
          chats: totalChats,
          forumPosts: totalPosts,
          appointments: totalAppointments,
        },
        recentActivity: {
          chatsLast7Days: recentChats,
          postsLast7Days: recentPosts,
          appointmentsLast7Days: recentAppointments,
        },
        topConcerns: topConcerns.map((concern) => ({
          name: concern.name,
          count: concern.count,
          percentage: ((concern.count / totalChats) * 100).toFixed(1),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview',
      error: error.message,
    });
  }
};

// ==========================================
// 6. MOOD ANALYTICS - Student wellness trends
// ==========================================
exports.moodAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Total mood entries
    const totalMoods = await Mood.countDocuments({
      createdAt: { $gte: daysAgo },
    });

    if (totalMoods === 0) {
      return res.json({
        success: true,
        moodAnalytics: {
          totalEntries: 0,
          message: 'No mood data available yet',
        },
      });
    }

    // Mood distribution (anonymous aggregation)
    const moodDistribution = await Mood.aggregate([
      {
        $match: {
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

    const moodBreakdown = moodDistribution.map((m) => ({
      mood: m._id,
      count: m.count,
      percentage: ((m.count / totalMoods) * 100).toFixed(1),
    }));

    // Most common actions taken
    const actionStats = await Mood.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
          triggeredActions: { $exists: true, $ne: [] },
        },
      },
      {
        $unwind: '$triggeredActions',
      },
      {
        $group: {
          _id: '$triggeredActions',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5
      },
    ]);

    res.json({
      success: true,
      moodAnalytics: {
        totalEntries: totalMoods,
        period: `Last ${days} days`,
        moodBreakdown,
        topActions: actionStats.map((a) => ({
          action: a._id,
          count: a.count,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood analytics',
      error: error.message,
    });
  }
};

// ==========================================
// 7. MOOD TRENDS - Day-by-day cohort trend
// ==========================================
// @desc    Campus-wide mood counts per day, plus week-over-week change
// @route   GET /api/admin/mood-trends
// @access  Private (Admin)
exports.moodTrends = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Daily counts per mood (anonymous - only groups on date + mood, never on user)
    const dailyTrend = await Mood.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            mood: '$mood',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // Reshape into { date, Great, Okay, Down, Anxious } rows for easy charting
    const byDate = {};
    dailyTrend.forEach(({ _id, count }) => {
      if (!byDate[_id.date]) byDate[_id.date] = { date: _id.date };
      byDate[_id.date][_id.mood] = count;
    });
    const trend = Object.values(byDate);

    // Week-over-week change in "negative" mood share (Down + Anxious)
    const negativeMoods = ['Down', 'Anxious'];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const [thisWeek, lastWeek] = await Promise.all([
      Mood.aggregate([
        { $match: { createdAt: { $gte: oneWeekAgo } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            negative: {
              $sum: { $cond: [{ $in: ['$mood', negativeMoods] }, 1, 0] },
            },
          },
        },
      ]),
      Mood.aggregate([
        { $match: { createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            negative: {
              $sum: { $cond: [{ $in: ['$mood', negativeMoods] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const pct = (row) =>
      row && row.total > 0 ? (row.negative / row.total) * 100 : null;

    const thisWeekPct = pct(thisWeek[0]);
    const lastWeekPct = pct(lastWeek[0]);
    const weekOverWeekChange =
      thisWeekPct !== null && lastWeekPct !== null && lastWeekPct !== 0
        ? Number((thisWeekPct - lastWeekPct).toFixed(1))
        : null;

    res.json({
      success: true,
      moodTrends: {
        period: `Last ${days} days`,
        trend,
        negativeMoodShare: {
          thisWeek: thisWeekPct !== null ? Number(thisWeekPct.toFixed(1)) : null,
          lastWeek: lastWeekPct !== null ? Number(lastWeekPct.toFixed(1)) : null,
          weekOverWeekChange,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood trends',
      error: error.message,
    });
  }
};

// ==========================================
// 8. CRISIS ALERTS - Students flagged by the escalation pipeline
// ==========================================
// @desc    List crisis alerts (open by default)
// @route   GET /api/admin/crisis-alerts?status=open
// @access  Private (Admin)
exports.getCrisisAlerts = async (req, res) => {
  try {
    const status = req.query.status || 'open';
    const filter = status === 'all' ? {} : { status };

    const alerts = await CrisisAlert.find(filter)
      .populate('student', 'name email')
      .populate('notifiedDoctor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark a crisis alert as reviewed
// @route   PUT /api/admin/crisis-alerts/:id/resolve
// @access  Private (Admin)
exports.resolveCrisisAlert = async (req, res) => {
  try {
    const alert = await CrisisAlert.findByIdAndUpdate(
      req.params.id,
      { status: 'reviewed' },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. BROADCAST - Admin sends a live announcement
// ==========================================
// @desc    Push a real-time announcement to all connected users
// @route   POST /api/admin/broadcast
// @access  Private (Admin)
exports.broadcastAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const { getIO } = require('../socket');
    getIO().emit('broadcast:announcement', {
      message,
      sentAt: new Date().toISOString(),
    });

    // Persist so it shows up in the notification bell even for users who
    // were offline when it was sent.
    const recipients = await User.find({ role: { $in: ['student', 'doctor'] } }).select('_id');
    notifyUsers(
      recipients.map((r) => r._id),
      { type: 'broadcast', title: 'Campus announcement', message }
    ).catch((err) => console.error('Broadcast notification persist failed:', err.message));

    res.json({ success: true, message: 'Announcement broadcast' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error broadcasting announcement',
      error: error.message,
    });
  }
};
