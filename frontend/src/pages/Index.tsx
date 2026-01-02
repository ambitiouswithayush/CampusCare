import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged-in users to their respective dashboards
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;