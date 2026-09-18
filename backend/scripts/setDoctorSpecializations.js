// One-time setup: assigns concern-area specializations to existing doctors
// so the smart appointment recommendation has real data to match against.
// Edit the map below to reflect your actual counselors, then run:
//   node scripts/setDoctorSpecializations.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const specializationsByEmail = {
  'anant.2327csit1200@kiet.edu': ['anxiety', 'stress', 'academic'],
  'doctor@campuscare.com': ['depression', 'career', 'relationships', 'general'],
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const [email, specialization] of Object.entries(specializationsByEmail)) {
    const doctor = await User.findOneAndUpdate(
      { email, role: 'doctor' },
      { specialization },
      { new: true }
    );
    console.log(doctor ? `Updated ${doctor.name}: ${specialization.join(', ')}` : `No doctor found for ${email}`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
