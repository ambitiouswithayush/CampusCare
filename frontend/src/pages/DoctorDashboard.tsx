import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  LogOut,
  Calendar,
  Check,
  X,
  Clock,
  User,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentsAPI } from '@/services/api';
import { toast } from 'sonner';

interface Appointment {
  _id: string;
  student: {
    name: string;
  };
  date?: string;
  time?: string;
  appointmentDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

const statusColors = {
  pending: { bg: 'bg-sunrise-light', text: 'text-sunrise', label: 'Pending' },
  approved: { bg: 'bg-healing-light', text: 'text-healing', label: 'Approved' },
  rejected: { bg: 'bg-crisis-light', text: 'text-crisis', label: 'Rejected' },
};

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (user.role !== 'doctor') {
      navigate('/dashboard');
    } else {
      loadAppointments();
    }
  }, [user, navigate]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await appointmentsAPI.getDoctorAppointments();
      if (response.success) {
        setAppointments(response.appointments);
      }
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await appointmentsAPI.updateAppointmentStatus(id, 'approved');
      if (response.success) {
        toast.success('Appointment approved');
        loadAppointments(); // Reload appointments
      }
    } catch (error) {
      console.error('Failed to approve appointment:', error);
      toast.error('Failed to approve appointment');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await appointmentsAPI.updateAppointmentStatus(id, 'rejected');
      if (response.success) {
        toast.success('Appointment rejected');
        loadAppointments(); // Reload appointments
      }
    } catch (error) {
      console.error('Failed to reject appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === filter);

  const pendingCount = appointments.filter(apt => apt.status === 'pending').length;
  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(apt => {
    const aptDate = apt.date || (apt.appointmentDate ? apt.appointmentDate.split('T')[0] : null);
    return aptDate === today && apt.status === 'approved';
  }).length;

  if (!user || user.role !== 'doctor') return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/doctor" className="flex items-center gap-2">
            <div className="p-2 rounded-xl gradient-healing">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CampusCare</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Welcome */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Counsellor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage appointments and support students.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6 rounded-3xl bg-card shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-sunrise-light">
                <Clock className="w-5 h-5 text-sunrise" />
              </div>
              <span className="text-muted-foreground">Pending</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
          </div>
          <div className="p-6 rounded-3xl bg-card shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-healing-light">
                <Calendar className="w-5 h-5 text-healing" />
              </div>
              <span className="text-muted-foreground">Today</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{todayCount}</p>
          </div>
          <div className="p-6 rounded-3xl bg-card shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-lavender-light">
                <User className="w-5 h-5 text-lavender" />
              </div>
              <span className="text-muted-foreground">Total</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{appointments.length}</p>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          className="flex gap-2 mb-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'healing' : 'soft'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </motion.div>

        {/* Appointments */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {appointments.length === 0 ? 'No appointments yet.' : 'No appointments found.'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt, index) => {
              const status = statusColors[apt.status];
              return (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-3xl bg-card shadow-card border border-border/50"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-muted">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Anonymous Student</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {apt.date && apt.time ? (
                            <>
                              {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at {apt.time}
                            </>
                          ) : apt.appointmentDate ? (
                            new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                          ) : (
                            'Date not available'
                          )}
                        </p>
                        {apt.reason && <p className="text-sm text-foreground">{apt.reason}</p>}
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {apt.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button variant="healing" size="sm" onClick={() => handleApprove(apt._id)}>
                          <Check className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleReject(apt._id)}>
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Crisis Resources */}
        <motion.div
          className="mt-8 p-6 rounded-3xl bg-crisis-light border border-crisis/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Phone className="w-5 h-5 text-crisis" />
            <h3 className="font-bold text-foreground">Emergency Contacts</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            National Crisis Helpline: <strong>1800-599-0019</strong> |
            Campus Emergency: <strong>+91 98765 43210</strong>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
