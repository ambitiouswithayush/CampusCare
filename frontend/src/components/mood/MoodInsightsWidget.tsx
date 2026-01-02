import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Loader2, TrendingUp } from 'lucide-react';
import { moodAPI } from '@/services/api';

interface Insight {
  type: string;
  message: string;
  suggestion: string;
}

interface MoodInsights {
  totalMoods: number;
  insights: Insight[];
}

export const MoodInsightsWidget = () => {
  const [insights, setInsights] = useState<MoodInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const response = await moodAPI.getMoodInsights();
      setInsights(response);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-3xl border border-purple-200 flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!insights || insights.totalMoods === 0) {
    return null; // Don't show if no data
  }

  if (insights.insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-3xl border border-purple-200"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-white shadow-sm">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Insights For You</h3>
        </div>
        <p className="text-muted-foreground">
          Keep logging your moods to unlock personalized insights! ✨
        </p>
      </motion.div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'frequency':
        return TrendingUp;
      case 'pattern':
        return Lightbulb;
      case 'trend':
        return Sparkles;
      default:
        return Sparkles;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'frequency':
        return 'bg-blue-100 text-blue-600';
      case 'pattern':
        return 'bg-orange-100 text-orange-600';
      case 'trend':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 p-6 rounded-3xl border border-purple-200 shadow-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-white shadow-sm">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Insights For You</h3>
          <p className="text-sm text-muted-foreground">
            Based on {insights.totalMoods} mood {insights.totalMoods === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const colorClass = getInsightColor(insight.type);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-2">{insight.message}</p>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground mt-0.5">💡</span>
                    <p className="text-sm text-muted-foreground flex-1">{insight.suggestion}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Encouragement message */}
      <div className="mt-6 p-4 bg-white/60 rounded-xl text-center">
        <p className="text-sm text-muted-foreground">
          💪 Keep tracking your moods to discover more patterns!
        </p>
      </div>
    </motion.div>
  );
};
