import { motion } from 'framer-motion';
import { Shield, Eye, Lock } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="py-24 gradient-calm" id="about">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why <span className="text-gradient">CampusCare</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We understand that reaching out for help can feel scary. That's why we built CampusCare — 
                a judgment-free zone where every student can access mental health support without fear or stigma.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're struggling with exam stress, feeling lonely, or just need someone to talk to at 2 AM, 
                CampusCare is here for you. Always available. Always confidential. Always supportive.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Shield, text: 'Built with students, for students' },
                  { icon: Eye, text: 'Anonymous by default — your identity is protected' },
                  { icon: Lock, text: 'End-to-end encryption for all conversations' },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="p-2 rounded-lg bg-healing-light">
                      <item.icon className="w-5 h-5 text-healing" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Decorative card stack */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-healing/10 transform rotate-3" />
                <div className="absolute -top-2 -left-2 w-full h-full rounded-3xl bg-lavender/10 transform rotate-1" />
                <div className="relative bg-card rounded-3xl p-8 shadow-card border border-border/50">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-healing-light">
                      <div className="w-12 h-12 rounded-full bg-healing flex items-center justify-center">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">10,000+</p>
                        <p className="text-sm text-muted-foreground">Students Supported</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-lavender-light">
                      <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">50,000+</p>
                        <p className="text-sm text-muted-foreground">Conversations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-sunrise-light">
                      <div className="w-12 h-12 rounded-full bg-sunrise flex items-center justify-center">
                        <span className="text-2xl">🏫</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">25+</p>
                        <p className="text-sm text-muted-foreground">Campus Partners</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
