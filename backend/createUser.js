const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'ayush.2327csit1152@kiet.edu' });
    if (existingUser) {
      console.log('User already exists!');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    // Create new user
    const newUser = await User.create({
      name: 'Ayush Kumar',
      email: 'ayush.2327csit1152@kiet.edu',
      password: hashedPassword,
      role: 'student',
    });

    console.log('✅ User created successfully!');
    console.log('Email:', newUser.email);
    console.log('Password: password');
    console.log('Role:', newUser.role);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createUser();
