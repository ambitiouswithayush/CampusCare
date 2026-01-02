import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { moodAPI } from '@/services/api';

interface MoodStats {
  totalEntries: number;
  period: string;
  breakdown: Array<{
    mood: string;
    count: number;
    percentage: string;
  }>;
  mostCommon: string | null;
}

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

export const MoodTrendsWidget = () => {
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodStats();
  }, []);

  const loadMoodStats = async () => {
    try {
      const response = await moodAPI.getMoodStats(7); // Last 7 days
      setMoodStats(response);
    } catch (error) {
      console.error('Error loading mood stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-3xl border border-border/50 flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!moodStats || moodStats.totalEntries === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-3xl border border-border/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-100">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Your Mood Trends</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">
          Start logging your moods to see your trends here! 📊
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-3xl shadow-card border border-border/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Your Mood Trends</h3>
            <p className="text-sm text-muted-foreground">{moodStats.period}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">{moodStats.totalEntries}</p>
          <p className="text-xs text-muted-foreground">check-ins</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={moodStats.breakdown}>
            <XAxis
              dataKey="mood"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => MOOD_EMOJIS[value] || value}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border">
                      <p className="font-semibold">
                        {MOOD_EMOJIS[data.mood]} {data.mood}
                      </p>
                      <p className="text-sm text-gray-600">
                        {data.count} times ({data.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {moodStats.breakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.mood]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mood Breakdown */}
      <div className="space-y-3">
        {moodStats.breakdown.map((mood) => (
          <div key={mood.mood} className="flex items-center gap-3">
            <span className="text-2xl">{MOOD_EMOJIS[mood.mood]}</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{mood.mood}</span>
                <span className="text-muted-foreground">
                  {mood.count} times · {mood.percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mood.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: MOOD_COLORS[mood.mood] }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Most Common Mood */}
      {moodStats.mostCommon && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Most common this week</p>
          <p className="text-lg font-bold text-foreground">
            {MOOD_EMOJIS[moodStats.mostCommon]} Feeling {moodStats.mostCommon}
          </p>
        </div>
      )}
    </motion.div>
  );
};
