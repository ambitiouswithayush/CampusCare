import { motion } from 'framer-motion';
import { MessageCircle, Calendar, BookOpen, Users, BarChart3, Heart } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Chat Corner',
    description: 'Get instant support from our AI companion, available 24/7. It understands your feelings and offers helpful guidance.',
    color: 'healing',
    bgColor: 'bg-healing-light',
  },
  {
    icon: Calendar,
    title: 'Confidential Booking',
    description: 'Book appointments with campus counsellors privately. No one will know except you and your counsellor.',
    color: 'lavender',
    bgColor: 'bg-lavender-light',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access articles, videos, and audio guides on mental wellness. Learn at your own pace, in your own language.',
    color: 'sunrise',
    bgColor: 'bg-sunrise-light',
  },
  {
    icon: Users,
    title: 'Student Common Room',
    description: 'Connect anonymously with fellow students. Share experiences, offer support, and realize you\'re not alone.',
    color: 'sage',
    bgColor: 'bg-sage-light',
  },
  {
    icon: BarChart3,
    title: 'Wellness Insights',
    description: 'Track your mood patterns and see your progress over time. Small steps lead to big changes.',
    color: 'healing',
    bgColor: 'bg-healing-light',
  },
  {
    icon: Heart,
    title: 'Crisis Support',
    description: 'Immediate access to helplines and emergency contacts when you need urgent support.',
    color: 'crisis',
    bgColor: 'bg-crisis-light',
  },
];

const colorMap: Record<string, string> = {
  healing: 'text-healing',
  lavender: 'text-lavender',
  sunrise: 'text-sunrise',
  sage: 'text-sage',
  crisis: 'text-crisis',
};

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Feel Better</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CampusCare brings together all the support tools you need in one safe, private space.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 rounded-3xl bg-card shadow-card hover:shadow-glow transition-all duration-500 border border-border/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-6`}>
                <feature.icon className={`w-7 h-7 ${colorMap[feature.color]}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-healing/5 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
