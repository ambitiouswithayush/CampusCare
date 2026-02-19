const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use local MongoDB if cloud connection fails, or use cloud URI if available
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campuscare';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Try local MongoDB as fallback
    try {
      const conn = await mongoose.connect('mongodb://localhost:27017/campuscare');
      console.log(`MongoDB Connected (local fallback): ${conn.connection.host}`);
    } catch (localError) {
      console.error('Local MongoDB also failed:', localError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
