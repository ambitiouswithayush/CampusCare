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

const resetPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    // Reset admin password
    const admin = await User.findOneAndUpdate(
      { email: 'admin@campuscare.edu' },
      { password: hashedPassword },
      { new: true }
    );

    if (admin) {
      console.log('✅ Admin password reset successfully!');
      console.log('Email: admin@campuscare.edu');
      console.log('Password: password');
      console.log('Role:', admin.role);
      console.log('---');
    } else {
      console.log('❌ Admin user not found. Creating new admin...');
      const newAdmin = await User.create({
        name: 'Admin',
        email: 'admin@campuscare.edu',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin created successfully!');
      console.log('Email:', newAdmin.email);
      console.log('Password: password');
      console.log('Role:', newAdmin.role);
      console.log('---');
    }

    // Reset counselor/doctor password
    const counselor = await User.findOneAndUpdate(
      { email: 'anant.2327csit1200@kiet.edu' },
      { password: hashedPassword },
      { new: true }
    );

    if (counselor) {
      console.log('✅ Counselor password reset successfully!');
      console.log('Email: anant.2327csit1200@kiet.edu');
      console.log('Password: password');
      console.log('Role:', counselor.role);
      console.log('---');
    }

    // Also check for doctor accounts
    const doctors = await User.find({ role: 'doctor' });
    if (doctors.length > 0) {
      console.log('\n📋 All Doctor Accounts:');
      for (const doc of doctors) {
        await User.findByIdAndUpdate(doc._id, { password: hashedPassword });
        console.log(`✅ Password reset for: ${doc.email} (${doc.name})`);
      }
    } else {
      console.log('\n⚠️  No doctor accounts found. Creating sample doctor...');
      const newDoctor = await User.create({
        name: 'Dr. Smith',
        email: 'doctor@campuscare.edu',
        password: hashedPassword,
        role: 'doctor',
      });
      console.log('✅ Doctor created:');
      console.log('Email:', newDoctor.email);
      console.log('Password: password');
      console.log('Role:', newDoctor.role);
    }

    console.log('\n🎉 All passwords have been reset to: password');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPasswords();
