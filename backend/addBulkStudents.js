const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const addBulkStudents = async (students) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const salt = await bcrypt.genSalt(10);
    let added = 0;
    let skipped = 0;

    for (const student of students) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: student.email });
      if (existingUser) {
        console.log(`⏭️  Skipped: ${student.email} (already exists)`);
        skipped++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(student.password || 'password', salt);

      // Create new student
      const newStudent = new User({
        name: student.name,
        email: student.email,
        password: hashedPassword,
        role: 'student',
        collegeId: student.collegeId || student.email.split('@')[0]
      });

      await newStudent.save();
      console.log(`✅ Added: ${student.name} (${student.email})`);
      added++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Added: ${added} students`);
    console.log(`   Skipped: ${skipped} students`);
    console.log(`   Total: ${students.length} students processed`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding students:', error.message);
    mongoose.connection.close();
  }
};

// Example student data
// Modify this array to add your students
const studentsToAdd = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.2327csit1201@kiet.edu',
    password: 'password',
    collegeId: '2327CSIT1201'
  },
  {
    name: 'Priya Singh',
    email: 'priya.2327csit1202@kiet.edu',
    password: 'password',
    collegeId: '2327CSIT1202'
  },
  {
    name: 'Amit Patel',
    email: 'amit.2327csit1203@kiet.edu',
    password: 'password',
    collegeId: '2327CSIT1203'
  },
  {
    name: 'Sneha Gupta',
    email: 'sneha.2327csit1204@kiet.edu',
    password: 'password',
    collegeId: '2327CSIT1204'
  },
  {
    name: 'Vikas Kumar',
    email: 'vikas.2327csit1205@kiet.edu',
    password: 'password',
    collegeId: '2327CSIT1205'
  }
];

console.log(`\n🚀 Starting bulk student registration...`);
console.log(`📝 Adding ${studentsToAdd.length} students\n`);

addBulkStudents(studentsToAdd);
