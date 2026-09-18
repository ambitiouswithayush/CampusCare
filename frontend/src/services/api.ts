import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campuscare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('campuscare_token');
      localStorage.removeItem('campuscare_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  register: async (name: string, email: string, password: string, role: string, collegeId?: string) => {
    const { data } = await api.post('/auth/register', { name, email, password, role, collegeId });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (message: string) => {
    const { data } = await api.post('/chat/send', { message });
    return data;
  },

  getChatHistory: async () => {
    const { data } = await api.get('/chat/history');
    return data;
  },
};

// Posts API (Community)
export const postsAPI = {
  getPosts: async () => {
    const { data } = await api.get('/posts');
    return data;
  },

  createPost: async (content: string, anonymous: boolean = true) => {
    const { data } = await api.post('/posts', { content, anonymous });
    return data;
  },

  replyToPost: async (postId: string, content: string) => {
    const { data } = await api.post(`/posts/${postId}/reply`, { content });
    return data;
  },
};

// Appointments API
export const appointmentsAPI = {
  createAppointment: async (doctorId: string, date: string, time: string, reason?: string) => {
    const { data } = await api.post('/appointments', { doctorId, date, time, reason });
    return data;
  },

  getStudentAppointments: async () => {
    const { data } = await api.get('/appointments/student');
    return data;
  },

  recommendDoctors: async (concern: string) => {
    const { data } = await api.get('/appointments/recommend', { params: { concern } });
    return data;
  },

  getDoctorAppointments: async () => {
    const { data } = await api.get('/appointments/doctor');
    return data;
  },

  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    const { data } = await api.patch(`/appointments/${appointmentId}/status`, { status });
    return data;
  },
};

// Resources API
export const resourcesAPI = {
  getResources: async () => {
    const { data } = await api.get('/resources');
    return data;
  },

  createResource: async (title: string, description: string, category: string, link: string) => {
    const { data } = await api.post('/resources', { title, description, category, link });
    return data;
  },

  uploadResource: async (formData: FormData) => {
    const { data } = await api.post('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteResource: async (id: string) => {
    const { data } = await api.delete(`/resources/${id}`);
    return data;
  },
};

// Mood API
export const moodAPI = {
  logMood: async (mood: string, emoji: string, note?: string) => {
    const { data } = await api.post('/moods', { mood, emoji, note });
    return data;
  },

  getMoodHistory: async (limit?: number, days?: number) => {
    const { data } = await api.get('/moods/history', { params: { limit, days } });
    return data;
  },

  getMoodStats: async (days?: number) => {
    const { data } = await api.get('/moods/stats', { params: { days } });
    return data;
  },

  getMoodInsights: async () => {
    const { data} = await api.get('/moods/insights');
    return data;
  },

  trackAction: async (moodId: string, action: string) => {
    const { data } = await api.post('/moods/track-action', { moodId, action });
    return data;
  },
};

// Admin API (Analytics)
export const adminAPI = {
  getDashboardOverview: async () => {
    const { data } = await api.get('/admin/overview');
    return data;
  },

  getChatInsights: async () => {
    const { data } = await api.get('/admin/chat-insights');
    return data;
  },

  getPeakUsage: async () => {
    const { data } = await api.get('/admin/peak-usage');
    return data;
  },

  getForumActivity: async () => {
    const { data } = await api.get('/admin/forum-activity');
    return data;
  },

  getAppointmentTrends: async () => {
    const { data } = await api.get('/admin/appointment-trends');
    return data;
  },

  getMoodAnalytics: async (days?: number) => {
    const { data } = await api.get('/admin/mood-analytics', { params: { days } });
    return data;
  },

  getMoodTrends: async (days?: number) => {
    const { data } = await api.get('/admin/mood-trends', { params: { days } });
    return data;
  },

  broadcastAnnouncement: async (message: string) => {
    const { data } = await api.post('/admin/broadcast', { message });
    return data;
  },

  getCrisisAlerts: async (status?: string) => {
    const { data } = await api.get('/admin/crisis-alerts', { params: { status } });
    return data;
  },

  resolveCrisisAlert: async (id: string) => {
    const { data } = await api.put(`/admin/crisis-alerts/${id}/resolve`);
    return data;
  },
};

// Weekly AI Wellness Reports
export const reportsAPI = {
  generateReport: async () => {
    const { data } = await api.post('/reports/generate');
    return data;
  },

  getMyReports: async () => {
    const { data } = await api.get('/reports');
    return data;
  },
};

// Notification bell (persisted history + live updates via socket)
export const notificationsAPI = {
  getMyNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },
};

export default api;
