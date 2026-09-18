import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  BookOpen,
  Users,
  Calendar,
  Heart,
  LogOut,
  TrendingUp,
  Phone,
  Shield,
  Sparkles,
  X,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MoodTrendsWidget } from '@/components/mood/MoodTrendsWidget';
import { MoodInsightsWidget } from '@/components/mood/MoodInsightsWidget';
import { MoodJournalDialog } from '@/components/mood/MoodJournalDialog';
import { moodAPI, reportsAPI } from '@/services/api';
import { NotificationBell } from '@/components/NotificationBell';

const quickActions = [
  {
    icon: MessageCircle,
    title: 'Chat with AI',
    description: 'Talk to our AI companion anytime',
    color: 'healing',
    bgColor: 'bg-healing-light',
    href: '/chat',
  },
  {
    icon: Users,
    title: 'Common Room',
    description: 'Connect with fellow students',
    color: 'lavender',
    bgColor: 'bg-lavender-light',
    href: '/community',
  },
  {
    icon: BookOpen,
    title: 'Resources',
    description: 'Explore wellness content',
    color: 'sunrise',
    bgColor: 'bg-sunrise-light',
    href: '/resources',
  },
  {
    icon: Calendar,
    title: 'Appointments',
    description: 'Book a counsellor session',
    color: 'sage',
    bgColor: 'bg-sage-light',
    href: '/appointments',
  },
];

const colorMap: Record<string, string> = {
  healing: 'text-healing',
  lavender: 'text-lavender',
  sunrise: 'text-sunrise',
  sage: 'text-sage',
};

// Mood options with suggestions
const moodOptions = [
  {
    emoji: '😊',
    label: 'Great',
    color: 'bg-green-100 border-green-300',
    suggestions: [
      { icon: TrendingUp, text: 'Keep this positive momentum going!', action: 'Share your tips in the Common Room', link: '/community' },
      { icon: BookOpen, text: 'Explore wellness resources to stay balanced', action: 'Browse Resources', link: '/resources' },
      { icon: Heart, text: 'Help others who might be struggling', action: 'Visit Common Room', link: '/community' },
    ],
  },
  {
    emoji: '😐',
    label: 'Okay',
    color: 'bg-blue-100 border-blue-300',
    suggestions: [
      { icon: MessageCircle, text: 'Chat with our AI companion for a mood boost', action: 'Start Chat', link: '/chat' },
      { icon: BookOpen, text: 'Discover tips for improving your day', action: 'View Resources', link: '/resources' },
      { icon: Users, text: 'Connect with peers in the Common Room', action: 'Join Community', link: '/community' },
    ],
  },
  {
    emoji: '😔',
    label: 'Down',
    color: 'bg-purple-100 border-purple-300',
    suggestions: [
      { icon: MessageCircle, text: 'Talk to our AI - it\'s here to listen', action: 'Chat Now', link: '/chat' },
      { icon: Calendar, text: 'Consider booking a counselor session', action: 'Book Appointment', link: '/appointments' },
      { icon: Users, text: 'You\'re not alone - connect with others', action: 'Common Room', link: '/community' },
      { icon: Phone, text: 'Need immediate help? Call crisis helpline', action: '1800-599-0019', link: null },
    ],
  },
  {
    emoji: '😰',
    label: 'Anxious',
    color: 'bg-orange-100 border-orange-300',
    suggestions: [
      { icon: MessageCircle, text: 'Chat with AI about what\'s bothering you', action: 'Start Chat', link: '/chat' },
      { icon: Calendar, text: 'Book an appointment with a counselor', action: 'Book Now', link: '/appointments' },
      { icon: BookOpen, text: 'Try guided breathing or relaxation exercises', action: 'View Resources', link: '/resources' },
      { icon: Phone, text: 'Crisis helpline available 24/7', action: 'Call 1800-599-0019', link: null },
    ],
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<typeof moodOptions[0] | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [latestMoodId, setLatestMoodId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [reports, setReports] = useState<Array<{ _id: string; fileUrl: string; createdAt: string; narrative: string }>>([]);
  const [generatingReport, setGeneratingReport] = useState(false);

  const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

  useEffect(() => {
    if (user && user.role === 'student') {
      reportsAPI.getMyReports().then((res) => {
        if (res.success) setReports(res.reports);
      }).catch(() => {});
    }
  }, [user]);

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const response = await reportsAPI.generateReport();
      if (response.success) {
        setReports((prev) => [response.report, ...prev]);
        toast.success('Your weekly wellness report is ready!');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Could not generate report right now');
    } finally {
      setGeneratingReport(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (user.role === 'admin') {
      // Admin users should go directly to admin dashboard
      navigate('/admin');
    } else if (user.role === 'doctor') {
      // Doctor users should go to doctor dashboard
      navigate('/doctor');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMoodSelect = (mood: typeof moodOptions[0]) => {
    setSelectedMood(mood);
    setShowJournal(true); // Show journal dialog instead of suggestions immediately
  };

  const handleJournalSave = async (note: string) => {
    if (!selectedMood) return;

    try {
      const response = await moodAPI.logMood(selectedMood.label, selectedMood.emoji, note);
      setLatestMoodId(response.mood._id);
      toast.success(`Mood logged: ${selectedMood.label}`);
      setShowJournal(false);
      setShowSuggestions(true);

      // Refresh mood widgets
      setRefreshKey(prev => prev + 1);

      // Save to localStorage as backup
      const moodLog = {
        mood: selectedMood.label,
        emoji: selectedMood.emoji,
        timestamp: new Date().toISOString(),
      };
      const existingLogs = JSON.parse(localStorage.getItem('mood_logs') || '[]');
      existingLogs.push(moodLog);
      localStorage.setItem('mood_logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood. Please try again.');
    }
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const handleSuggestionClick = async (link: string | null) => {
    if (link && latestMoodId) {
      try {
        // Track which action was clicked
        const action = link.split('/')[1]; // Extract 'chat', 'appointments', 'community', 'resources'
        await moodAPI.trackAction(latestMoodId, action);
      } catch (error) {
        console.error('Error tracking action:', error);
      }
      navigate(link);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-xl gradient-healing">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CampusCare</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, {user.name.split(' ')[0]}!
            </span>
            <NotificationBell />
            {user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                </Button>
              </Link>
            )}
            {user.role === 'doctor' && (
              <Link to="/doctor">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Doctor Dashboard</span>
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            How are you feeling today? We're here to support you.
          </p>
        </motion.div>

        {/* Mood Check-in Card */}
        <motion.div
          className="mb-10 p-6 rounded-3xl gradient-hero border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">How are you feeling?</h2>
              <p className="text-muted-foreground">Click to track your mood and get personalized suggestions</p>
            </div>
            <div className="flex gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.emoji}
                  className={`w-14 h-14 rounded-2xl shadow-card flex flex-col items-center justify-center text-2xl transition-all hover:scale-110 ${
                    selectedMood?.emoji === mood.emoji ? `${mood.color} border-2 scale-110` : 'bg-card hover:bg-card/80'
                  }`}
                  onClick={() => handleMoodSelect(mood)}
                  title={mood.label}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Suggestions Popup */}
          <AnimatePresence>
            {showSuggestions && selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={`p-6 rounded-2xl border-2 ${selectedMood.color} relative`}>
                  <button
                    onClick={handleCloseSuggestions}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{selectedMood.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Feeling {selectedMood.label}</h3>
                      <p className="text-sm text-muted-foreground">Here are some suggestions for you</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedMood.suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all cursor-pointer group"
                        onClick={() => handleSuggestionClick(suggestion.link)}
                      >
                        <div className="p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
                          <suggestion.icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-1">{suggestion.text}</p>
                          <p className="text-sm text-primary group-hover:underline flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {suggestion.action}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} to={action.href}>
                <motion.div
                  className="p-6 rounded-3xl bg-card shadow-card border border-border/50 hover:shadow-glow transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`inline-flex p-3 rounded-2xl ${action.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 ${colorMap[action.color]}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Mood Trends & Insights */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MoodTrendsWidget key={`trends-${refreshKey}`} />
            <MoodInsightsWidget key={`insights-${refreshKey}`} />
          </div>
        </motion.div>

        {/* Stats & Crisis Helpline */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="p-6 rounded-3xl bg-card shadow-card border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-healing-light">
                <TrendingUp className="w-5 h-5 text-healing" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Your Wellness Journey</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-healing">5</p>
                <p className="text-sm text-muted-foreground">Check-ins</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-lavender">12</p>
                <p className="text-sm text-muted-foreground">Resources Read</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-sunrise">3</p>
                <p className="text-sm text-muted-foreground">Days Active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-6 rounded-3xl bg-crisis-light border border-crisis/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-crisis/20">
                <Phone className="w-5 h-5 text-crisis" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Need Immediate Help?</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              If you're in crisis, reach out to trained professionals who care.
            </p>
            <Button variant="crisis" size="sm">
              <Phone className="w-4 h-4" />
              Crisis Helpline: 1800-599-0019
            </Button>
          </motion.div>
        </div>

        {/* Weekly AI Wellness Report */}
        <motion.div
          className="mt-6 p-6 rounded-3xl bg-card shadow-card border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-lavender-light">
                <FileText className="w-5 h-5 text-lavender" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Weekly Wellness Report</h3>
                <p className="text-sm text-muted-foreground">AI-generated summary of your week, auto-created every Sunday</p>
              </div>
            </div>
            <Button variant="healing" size="sm" onClick={handleGenerateReport} disabled={generatingReport}>
              <Sparkles className="w-4 h-4" />
              {generatingReport ? 'Generating...' : 'Generate now'}
            </Button>
          </div>

          {reports.length > 0 && (
            <div className="space-y-2">
              {reports.slice(0, 3).map((report) => (
                <a
                  key={report._id}
                  href={`${SERVER_URL}${report.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-muted transition-colors"
                >
                  <span className="text-sm text-foreground">
                    Report from {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Mood Journal Dialog */}
      {showJournal && selectedMood && (
        <MoodJournalDialog
          mood={selectedMood}
          onSave={handleJournalSave}
          onClose={() => setShowJournal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;