const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const doctors = await User.find({ role: 'doctor' });
  console.log('Doctors:', JSON.stringify(doctors, null, 2));
  
  const Appointment = require('./models/Appointment');
  const appointments = await Appointment.find({});
  console.log('\nAppointments:', JSON.stringify(appointments, null, 2));
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
