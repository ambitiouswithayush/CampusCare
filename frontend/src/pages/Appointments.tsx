import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsAPI } from '@/services/api';
import { toast } from 'sonner';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '2:00 PM', '3:00 PM', '4:00 PM'
];

const getNextWeekDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const CONCERNS = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'stress', label: 'Stress' },
  { value: 'depression', label: 'Low mood / Depression' },
  { value: 'academic', label: 'Academic pressure' },
  { value: 'career', label: 'Career guidance' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'general', label: 'Something else' },
];

interface DoctorRecommendation {
  _id: string;
  name: string;
  email: string;
  specialization: string[];
  reasons: string[];
}

const Appointments = () => {
  const [concern, setConcern] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<DoctorRecommendation[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecommendation | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dates = getNextWeekDates();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handlePickConcern = async (value: string) => {
    setConcern(value);
    setSelectedDoctor(null);
    setIsMatching(true);
    try {
      const response = await appointmentsAPI.recommendDoctors(value);
      if (response.success) {
        setRecommendations(response.recommendations);
        if (response.recommendations.length > 0) {
          setSelectedDoctor(response.recommendations[0]);
        }
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast.error('Could not fetch counselor recommendations');
    } finally {
      setIsMatching(false);
    }
  };

  const handleBook = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a counselor');
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    setIsLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      const response = await appointmentsAPI.createAppointment(
        selectedDoctor._id,
        dateString,
        selectedTime,
        reason
      );

      if (response.success) {
        setIsBooked(true);
        toast.success('Appointment requested successfully!');
      }
    } catch (error: any) {
      console.error('Failed to book appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sage-light">
                <CalendarIcon className="w-5 h-5 text-sage" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Appointments</h1>
                <p className="text-xs text-muted-foreground">Book a counsellor session</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16 max-w-md text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-healing-light flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-healing" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Appointment Requested!</h2>
          <p className="text-muted-foreground mb-2">
            {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            You'll receive a confirmation once the counsellor approves your request.
          </p>
          <Link to="/dashboard">
            <Button variant="healing">Back to Dashboard</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sage-light">
              <CalendarIcon className="w-5 h-5 text-sage" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Appointments</h1>
              <p className="text-xs text-muted-foreground">Book a counsellor session</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">What's this about?</h2>
          <p className="text-muted-foreground">We'll match you with the counselor who fits best</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {CONCERNS.map((c) => (
            <button
              key={c.value}
              onClick={() => handlePickConcern(c.value)}
              className={`p-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                concern === c.value
                  ? 'border-healing bg-healing-light text-healing'
                  : 'border-border bg-card text-foreground hover:border-healing/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </motion.div>

        {isMatching && (
          <p className="text-sm text-muted-foreground mb-8">Finding the best counselor for you...</p>
        )}

        {concern && !isMatching && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-healing" />
              Recommended Counselor
            </h2>
            <div className="space-y-3">
              {recommendations.map((doc, idx) => (
                <button
                  key={doc._id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedDoctor?._id === doc._id
                      ? 'border-healing bg-healing-light'
                      : 'border-border bg-card hover:border-healing/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-foreground">{doc.name}</p>
                    {idx === 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-healing text-primary-foreground">
                        Best match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{doc.reasons.join(' • ')}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedDoctor && (
        <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Select a Date</h2>
          <p className="text-muted-foreground">Choose an available date for your session</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {dates.map((date, index) => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedDate?.toDateString() === date.toDateString()
                  ? 'border-healing bg-healing-light'
                  : 'border-border bg-card hover:border-healing/50'
              }`}
            >
              <p className="text-xs text-muted-foreground">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className={`text-lg font-bold ${
                selectedDate?.toDateString() === date.toDateString() ? 'text-healing' : 'text-foreground'
              }`}>
                {date.getDate()}
              </p>
            </button>
          ))}
        </motion.div>

        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-healing" />
              Select a Time
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedTime === time
                      ? 'border-healing bg-healing-light'
                      : 'border-border bg-card hover:border-healing/50'
                  }`}
                >
                  <p className={`font-medium ${
                    selectedTime === time ? 'text-healing' : 'text-foreground'
                  }`}>
                    {time}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Reason (Optional)</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe why you'd like to meet (optional, kept confidential)"
              className="w-full h-24 p-4 rounded-2xl border-2 border-border bg-card resize-none focus:outline-none focus:border-healing transition-colors mb-6"
            />
            <Button
              variant="healing"
              className="w-full"
              size="lg"
              onClick={handleBook}
              disabled={isLoading}
            >
              {isLoading ? 'Booking...' : 'Request Appointment'}
            </Button>
          </motion.div>
        )}
        </>
        )}
      </main>
    </div>
  );
};

export default Appointments;
