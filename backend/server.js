const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');
const { scheduleWeeklyReports } = require('./services/weeklyReportCron');
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL || 'https://campuscare.vercel.app',
        /\.vercel\.app$/  // Allow all Vercel preview deployments
      ]
    : '*',  // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/moods', require('./routes/moodRoutes')); // Mood tracking routes
app.use('/api/admin', require('./routes/adminRoutes')); // Admin analytics routes
app.use('/api/reports', require('./routes/reportRoutes')); // Weekly wellness reports
app.use('/api/notifications', require('./routes/notificationRoutes')); // Persisted notification bell


// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 CampusCare Backend is running'
  });
});

// Create HTTP server manually so Socket.IO can attach to the same port
const server = http.createServer(app);
initSocket(server, corsOptions);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  scheduleWeeklyReports();
});
