import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

export const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.9)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-healing/10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 rounded-full bg-lavender/20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-sunrise/15"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-16 h-16 rounded-full bg-sage/20"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-healing-light border border-healing/20 mb-8">
              <Sparkles className="w-4 h-4 text-healing" />
              <span className="text-sm font-medium text-healing">Your Safe Space on Campus</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-foreground">Welcome to </span>
            <span className="text-gradient">CampusCare</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your digital companion for mental wellness. Get support 24/7, connect with peers, and take control of your well-being journey.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/auth">
              <Button variant="hero" size="xl">
                Get Started Free
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="xl">
                I'm a Counsellor
              </Button>
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: Heart, text: '24/7 AI Support' },
              { icon: Shield, text: 'Complete Privacy' },
              { icon: Users, text: 'Peer Community' },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                <item.icon className="w-4 h-4 text-healing" />
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
