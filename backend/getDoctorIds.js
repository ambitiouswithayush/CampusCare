const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const getDoctorIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');

    // Find all doctors
    const doctors = await User.find({ role: 'doctor' });

    if (doctors.length === 0) {
      console.log('❌ No doctors found in database!');
      process.exit(0);
    }

    console.log('📋 All Doctor Accounts:\n');
    console.log('=' .repeat(70));

    doctors.forEach((doctor, index) => {
      console.log(`\nDoctor #${index + 1}:`);
      console.log(`  Name: ${doctor.name}`);
      console.log(`  Email: ${doctor.email}`);
      console.log(`  User ID: ${doctor._id}`);
      console.log(`  Password: password`);
      console.log('-'.repeat(70));
    });

    console.log(`\n✅ Total Doctors: ${doctors.length}`);
    console.log('\n📝 To use in frontend Appointments.tsx:');
    console.log(`const DEFAULT_DOCTOR_ID = '${doctors[0]._id}'; // ${doctors[0].name} (${doctors[0].email})`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getDoctorIds();
