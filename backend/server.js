const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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


// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 CampusCare Backend is running'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



