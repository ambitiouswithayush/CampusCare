const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixUserPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'ayush.2327csit1152@kiet.edu';
    const newPassword = 'password';

    // Find the user
    let user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found:', email);
      console.log('Creating new user with proper schema...');
      
      // Create new user with all required fields
      user = await User.create({
        name: 'Ayush Kumar',
        email: email,
        password: newPassword,
        role: 'student',
        collegeId: '2327csit1152'
      });
      
      console.log('✅ User created successfully!');
    } else {
      console.log('✅ User found:', user.email);
      console.log('Current role:', user.role);
      console.log('Current collegeId:', user.collegeId);
      
      // Update password - the pre-save hook will hash it
      user.password = newPassword;
      await user.save();
      
      console.log('✅ Password reset successfully!');
    }

    console.log('\n📋 User Details:');
    console.log('Email:', user.email);
    console.log('Password:', newPassword);
    console.log('Role:', user.role);
    console.log('College ID:', user.collegeId);
    console.log('---');

    // Verify password works
    const verifyUser = await User.findOne({ email }).select('+password');
    const isMatch = await verifyUser.matchPassword(newPassword);
    console.log('Password verification:', isMatch ? '✅ SUCCESS' : '❌ FAILED');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixUserPassword();
