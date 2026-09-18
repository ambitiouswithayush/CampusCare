import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Clock,
  Activity,
  Shield,
  AlertCircle,
  LogOut,
  Smile,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface DashboardOverview {
  totalEngagement: {
    chats: number;
    forumPosts: number;
    appointments: number;
  };
  recentActivity: {
    chatsLast7Days: number;
    postsLast7Days: number;
    appointmentsLast7Days: number;
  };
  topConcerns: Array<{
    name: string;
    count: number;
    percentage: string;
  }>;
}

interface ChatInsights {
  totalChats: number;
  concerns: {
    examStress: { count: number; percentage: string };
    sleepIssues: { count: number; percentage: string };
    anxietyStress: { count: number; percentage: string };
    loneliness: { count: number; percentage: string };
    depression: { count: number; percentage: string };
  };
}

interface PeakUsage {
  chat: {
    hourlyDistribution: Array<{ hour: number; count: number; timeLabel: string }>;
    peakHour: { hour: number; count: number; timeLabel: string } | null;
  };
  forum: {
    hourlyDistribution: Array<{ hour: number; count: number; timeLabel: string }>;
    peakHour: { hour: number; count: number; timeLabel: string } | null;
  };
}

interface ForumActivity {
  totalPosts: number;
  totalReplies: number;
  avgRepliesPerPost: string;
  anonymousPostsPercentage: string;
  recentActivity: {
    postsLast7Days: number;
  };
}

interface AppointmentTrends {
  total: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  statusPercentages: {
    pendingPercent: string;
    approvedPercent: string;
    rejectedPercent: string;
  };
  topReasons: Array<{
    rank: number;
    reason: string;
    count: number;
    percentage: string;
  }>;
}

interface CrisisAlertItem {
  _id: string;
  student: { name: string; email: string };
  type: 'mood_streak' | 'chat_keyword';
  details: string;
  status: 'open' | 'reviewed';
  createdAt: string;
}

interface MoodTrends {
  period: string;
  trend: Array<Record<string, string | number>>;
  negativeMoodShare: {
    thisWeek: number | null;
    lastWeek: number | null;
    weekOverWeekChange: number | null;
  };
}

interface MoodAnalytics {
  totalEntries: number;
  period: string;
  moodBreakdown: Array<{
    mood: string;
    count: number;
    percentage: string;
  }>;
  topActions: Array<{
    action: string;
    count: number;
  }>;
  insights: {
    mostStressfulDay: string;
    engagementRate: string;
  };
}

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

const MOOD_COLORS: Record<string, string> = {
  Great: '#10B981',
  Okay: '#3B82F6',
  Down: '#A855F7',
  Anxious: '#F59E0B',
};

const MOOD_EMOJIS: Record<string, string> = {
  Great: '😊',
  Okay: '😐',
  Down: '😔',
  Anxious: '😰',
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [chatInsights, setChatInsights] = useState<ChatInsights | null>(null);
  const [peakUsage, setPeakUsage] = useState<PeakUsage | null>(null);
  const [forumActivity, setForumActivity] = useState<ForumActivity | null>(null);
  const [appointmentTrends, setAppointmentTrends] = useState<AppointmentTrends | null>(null);
  const [moodAnalytics, setMoodAnalytics] = useState<MoodAnalytics | null>(null);
  const [moodTrends, setMoodTrends] = useState<MoodTrends | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can access this page',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    fetchAllData();
    loadCrisisAlerts();
  }, [user, navigate]);

  // Live: new crisis alerts pop in immediately without a refresh
  useEffect(() => {
    if (!socket) return;
    const handleAlert = () => loadCrisisAlerts();
    socket.on('crisis:alert', handleAlert);
    return () => {
      socket.off('crisis:alert', handleAlert);
    };
  }, [socket]);

  const loadCrisisAlerts = async () => {
    try {
      const response = await adminAPI.getCrisisAlerts('open');
      if (response.success) setCrisisAlerts(response.alerts);
    } catch (error) {
      console.error('Failed to load crisis alerts:', error);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await adminAPI.resolveCrisisAlert(id);
      setCrisisAlerts((prev) => prev.filter((a) => a._id !== id));
      toast({ title: 'Alert reviewed', description: 'Marked as handled.' });
    } catch (error) {
      toast({ title: 'Failed to resolve alert', variant: 'destructive' });
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [overviewRes, chatRes, peakRes, forumRes, appointmentRes, moodRes, moodTrendsRes] = await Promise.all([
        adminAPI.getDashboardOverview(),
        adminAPI.getChatInsights(),
        adminAPI.getPeakUsage(),
        adminAPI.getForumActivity(),
        adminAPI.getAppointmentTrends(),
        adminAPI.getMoodAnalytics(30),
        adminAPI.getMoodTrends(30),
      ]);

      setOverview(overviewRes.overview);
      setChatInsights(chatRes.insights);
      setPeakUsage(peakRes.peakUsage);
      setForumActivity(forumRes.forumActivity);
      setAppointmentTrends(appointmentRes.appointmentTrends);
      setMoodAnalytics(moodRes.moodAnalytics);
      setMoodTrends(moodTrendsRes.moodTrends);
    } catch (error: any) {
      toast({
        title: 'Error Loading Data',
        description: error.response?.data?.message || 'Failed to load analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      setSendingBroadcast(true);
      await adminAPI.broadcastAnnouncement(broadcastMessage.trim());
      toast({ title: 'Announcement sent', description: 'All connected students were notified live.' });
      setBroadcastMessage('');
    } catch (error: any) {
      toast({
        title: 'Broadcast failed',
        description: error.response?.data?.message || 'Could not send announcement',
        variant: 'destructive',
      });
    } finally {
      setSendingBroadcast(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const concernsData = chatInsights
    ? [
        { name: 'Anxiety', value: parseFloat(chatInsights.concerns.anxietyStress.percentage), count: chatInsights.concerns.anxietyStress.count },
        { name: 'Exam Stress', value: parseFloat(chatInsights.concerns.examStress.percentage), count: chatInsights.concerns.examStress.count },
        { name: 'Sleep Issues', value: parseFloat(chatInsights.concerns.sleepIssues.percentage), count: chatInsights.concerns.sleepIssues.count },
        { name: 'Loneliness', value: parseFloat(chatInsights.concerns.loneliness.percentage), count: chatInsights.concerns.loneliness.count },
        { name: 'Depression', value: parseFloat(chatInsights.concerns.depression.percentage), count: chatInsights.concerns.depression.count },
      ]
    : [];

  const appointmentStatusData = appointmentTrends
    ? [
        { name: 'Pending', value: appointmentTrends.byStatus.pending },
        { name: 'Approved', value: appointmentTrends.byStatus.approved },
        { name: 'Rejected', value: appointmentTrends.byStatus.rejected },
      ].filter(item => item.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Principal's Office</h1>
                <p className="text-sm text-gray-600">Anonymous Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Live broadcast */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2 text-gray-700 shrink-0">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Broadcast a live announcement</span>
          </div>
          <input
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="e.g. Counseling office closed tomorrow due to maintenance"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"
            onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
          />
          <Button onClick={handleBroadcast} disabled={sendingBroadcast || !broadcastMessage.trim()} size="sm">
            {sendingBroadcast ? 'Sending...' : 'Send to all students'}
          </Button>
        </div>

        {/* Crisis Alerts */}
        {crisisAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-300 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-bold text-red-700">
                {crisisAlerts.length} student{crisisAlerts.length > 1 ? 's' : ''} may need immediate support
              </h2>
            </div>
            <div className="space-y-3">
              {crisisAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-3 border border-red-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {alert.student?.name}{' '}
                      <span className="text-xs font-normal text-gray-500">({alert.student?.email})</span>
                    </p>
                    <p className="text-sm text-gray-600">{alert.details}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {alert.type === 'mood_streak' ? 'Sustained low mood' : 'Flagged in AI chat'} •{' '}
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert._id)}>
                    Mark reviewed
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900">Privacy Protected Analytics</h3>
            <p className="text-sm text-purple-700">
              All data shown is completely anonymous and aggregated. No individual student names, emails, or
              personal information is displayed. This dashboard helps identify trends to improve campus wellness.
            </p>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={MessageCircle}
            title="Total Chat Sessions"
            value={overview?.totalEngagement.chats || 0}
            trend={`${overview?.recentActivity.chatsLast7Days || 0} in last 7 days`}
            color="purple"
          />
          <StatCard
            icon={Users}
            title="Forum Posts"
            value={overview?.totalEngagement.forumPosts || 0}
            trend={`${overview?.recentActivity.postsLast7Days || 0} in last 7 days`}
            color="pink"
          />
          <StatCard
            icon={Calendar}
            title="Appointments"
            value={overview?.totalEngagement.appointments || 0}
            trend={`${overview?.recentActivity.appointmentsLast7Days || 0} in last 7 days`}
            color="blue"
          />
        </div>

        {/* Top Concerns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Mental Health Concerns</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={concernsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value: any, name: string, props: any) => [
                      `${value}% (${props.payload.count} messages)`,
                      'Percentage',
                    ]}
                  />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {overview?.topConcerns.map((concern, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{concern.name}</p>
                      <p className="text-sm text-gray-600">{concern.count} mentions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{concern.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Peak Usage Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Peak Activity Hours</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Chat Activity</h3>
              {peakUsage?.chat.peakHour && (
                <p className="text-sm text-gray-600 mb-4">
                  Peak: {peakUsage.chat.peakHour.timeLabel} ({peakUsage.chat.peakHour.count} messages)
                </p>
              )}
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={peakUsage?.chat.hourlyDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip labelFormatter={(hour) => `${hour}:00 - ${hour}:59`} />
                  <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Forum Activity</h3>
              {peakUsage?.forum.peakHour && (
                <p className="text-sm text-gray-600 mb-4">
                  Peak: {peakUsage.forum.peakHour.timeLabel} ({peakUsage.forum.peakHour.count} posts)
                </p>
              )}
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={peakUsage?.forum.hourlyDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip labelFormatter={(hour) => `${hour}:00 - ${hour}:59`} />
                  <Line type="monotone" dataKey="count" stroke="#EC4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Forum & Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Forum Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Peer Support Forum</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                <span className="text-gray-700">Total Posts</span>
                <span className="text-2xl font-bold text-pink-600">{forumActivity?.totalPosts || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Total Replies</span>
                <span className="text-2xl font-bold text-purple-600">{forumActivity?.totalReplies || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Avg Replies/Post</span>
                <span className="text-2xl font-bold text-blue-600">{forumActivity?.avgRepliesPerPost || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Anonymous Posts</span>
                <span className="text-2xl font-bold text-green-600">{forumActivity?.anonymousPostsPercentage || 0}%</span>
              </div>
            </div>
          </motion.div>

          {/* Appointment Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment Status</h2>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Top Appointment Reasons</h3>
              {appointmentTrends?.topReasons.slice(0, 3).map((reason) => (
                <div key={reason.rank} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{reason.reason || 'Not specified'}</span>
                  <span className="text-sm font-semibold text-gray-900">{reason.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mood Analytics */}
        {moodAnalytics && moodAnalytics.totalEntries > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Smile className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Student Mood Analytics</h2>
            </div>

            {moodTrends && moodTrends.trend.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Campus-wide Mood Trend ({moodTrends.period})</h3>
                  {moodTrends.negativeMoodShare.weekOverWeekChange !== null && (
                    <span
                      className={`text-sm font-semibold flex items-center gap-1 ${
                        moodTrends.negativeMoodShare.weekOverWeekChange > 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      {moodTrends.negativeMoodShare.weekOverWeekChange > 0 ? '+' : ''}
                      {moodTrends.negativeMoodShare.weekOverWeekChange}% "Down/Anxious" vs last week
                    </span>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={moodTrends.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(MOOD_COLORS).map((mood) => (
                      <Line
                        key={mood}
                        type="monotone"
                        dataKey={mood}
                        stroke={MOOD_COLORS[mood]}
                        strokeWidth={2}
                        connectNulls
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Mood Distribution Pie Chart */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Mood Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={moodAnalytics.moodBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ mood, percentage }) => `${MOOD_EMOJIS[mood]} ${percentage}%`}
                      outerRadius={80}
                      dataKey="count"
                    >
                      {moodAnalytics.moodBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.mood]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: string, props: any) => [
                        `${value} students (${props.payload.percentage}%)`,
                        `${MOOD_EMOJIS[props.payload.mood]} ${props.payload.mood}`,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Cards */}
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Total Check-ins</span>
                  <span className="text-2xl font-bold text-gray-900">{moodAnalytics.totalEntries}</span>
                </div>

                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Period</span>
                  <span className="font-semibold text-blue-600">{moodAnalytics.period}</span>
                </div>

                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Engagement Rate</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {moodAnalytics.insights?.engagementRate || '0%'}
                  </span>
                </div>

                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">Most Stressful Day</span>
                  <span className="text-xl font-bold text-orange-600">
                    {moodAnalytics.insights?.mostStressfulDay || 'No data'}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Actions */}
            {moodAnalytics.topActions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">What Students Did After Logging Mood</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {moodAnalytics.topActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                    >
                      <p className="text-sm text-gray-600 mb-1">Action</p>
                      <p className="text-lg font-bold capitalize text-gray-900">{action.action}</p>
                      <p className="text-2xl font-bold text-purple-600 mt-2">{action.count} times</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5" />
                <h3 className="font-bold">AI Recommendations</h3>
              </div>
              <ul className="text-sm space-y-1">
                {(() => {
                  const anxiousPercentage = parseFloat(
                    moodAnalytics.moodBreakdown.find((m) => m.mood === 'Anxious')?.percentage || '0'
                  );
                  const downPercentage = parseFloat(
                    moodAnalytics.moodBreakdown.find((m) => m.mood === 'Down')?.percentage || '0'
                  );
                  const engagementRate = parseFloat(moodAnalytics.insights?.engagementRate || '0');
                  const mostStressfulDay = moodAnalytics.insights?.mostStressfulDay || 'No data';

                  return (
                    <>
                      <li>
                        • {anxiousPercentage + downPercentage > 20
                          ? `${(anxiousPercentage + downPercentage).toFixed(1)}% of students are struggling - consider organizing stress management workshops`
                          : 'Mental health metrics are stable - continue current support initiatives'}
                      </li>
                      <li>
                        • {mostStressfulDay !== 'No data'
                          ? `Add support groups on ${mostStressfulDay}s to help with weekly stress patterns`
                          : 'Continue monitoring weekly patterns for intervention opportunities'}
                      </li>
                      <li>
                        • {engagementRate > 40
                          ? `Great ${moodAnalytics.insights?.engagementRate || '0%'} engagement! Students are actively using mood tracking`
                          : 'Promote mood tracking feature to increase student engagement and early intervention'}
                      </li>
                    </>
                  );
                })()}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Actionable Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-xl font-bold">Actionable Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview && overview.topConcerns[0] && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">Top Concern: {overview.topConcerns[0].name}</h3>
                <p className="text-sm">
                  {overview.topConcerns[0].percentage}% of students mentioned this. Consider organizing workshops or
                  support groups focused on {overview.topConcerns[0].name.toLowerCase()}.
                </p>
              </div>
            )}
            {peakUsage?.chat.peakHour && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">Peak Activity: {peakUsage.chat.peakHour.timeLabel}</h3>
                <p className="text-sm">
                  Students are most active during these hours. Ensure counselors and support staff are available during
                  peak times.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  color,
}: {
  icon: any;
  title: string;
  value: number;
  trend: string;
  color: string;
}) => {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    pink: 'bg-pink-50 text-pink-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-2">{trend}</p>
    </motion.div>
  );
};

export default AdminDashboard;
