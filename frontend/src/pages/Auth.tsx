import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Mail, Lock, User, ArrowLeft, GraduationCap, Stethoscope } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'doctor'>('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    collegeId: '',
  });
  
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        if (!formData.name.trim()) {
          toast.error('Please enter your name');
          setIsLoading(false);
          return;
        }
        if (role === 'student' && !formData.collegeId.trim()) {
          toast.error('Please enter your college ID');
          setIsLoading(false);
          return;
        }
        const result = await signup(formData.email, formData.password, formData.name, role, formData.collegeId);
        if (result.success) {
          toast.success('Account created successfully!');
          // Navigation will be handled by useEffect based on user role
        } else {
          toast.error(result.error || 'Signup failed');
        }
      } else {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success('Welcome back!');
        } else {
          toast.error(result.error || 'Login failed');
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl gradient-healing">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CampusCare</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isSignup ? 'Start your wellness journey today' : 'Sign in to continue your journey'}
          </p>

          {/* Role selector for signup */}
          {isSignup && (
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                  role === 'student'
                    ? 'border-healing bg-healing-light'
                    : 'border-border hover:border-healing/50'
                }`}
              >
                <GraduationCap className={`w-6 h-6 mx-auto mb-2 ${role === 'student' ? 'text-healing' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-medium ${role === 'student' ? 'text-healing' : 'text-muted-foreground'}`}>Student</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                  role === 'doctor'
                    ? 'border-healing bg-healing-light'
                    : 'border-border hover:border-healing/50'
                }`}
              >
                <Stethoscope className={`w-6 h-6 mx-auto mb-2 ${role === 'doctor' ? 'text-healing' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-medium ${role === 'doctor' ? 'text-healing' : 'text-muted-foreground'}`}>Counsellor</p>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-12"
                    required
                  />
                </div>
                {role === 'student' && (
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="College ID"
                      value={formData.collegeId}
                      onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                      className="pl-12"
                      required
                    />
                  </div>
                )}
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" variant="healing" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-healing font-semibold hover:underline"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {/* Demo credentials hint */}
          {!isSignup && (
            <div className="mt-6 p-4 rounded-2xl bg-muted/50 text-sm">
              <p className="text-muted-foreground font-medium mb-2">Demo accounts:</p>
              <p className="text-muted-foreground">Student: student@campus.edu</p>
              <p className="text-muted-foreground">Doctor: doctor@campus.edu</p>
              <p className="text-muted-foreground">(any password with 6+ chars)</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;