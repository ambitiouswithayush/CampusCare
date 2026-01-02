const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const addStudent = async (name, email, password, collegeId) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ Student with email ${email} already exists`);
      mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      collegeId: collegeId || email.split('@')[0]
    });

    await student.save();
    console.log(`✅ Student added successfully!`);
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   College ID: ${student.collegeId}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding student:', error.message);
    mongoose.connection.close();
  }
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('\n📝 Usage: node addStudent.js <name> <email> <password> [collegeId]\n');
  console.log('Example: node addStudent.js "John Doe" "john@kiet.edu" "password123" "2327CSIT1001"\n');
  process.exit(1);
}

const [name, email, password, collegeId] = args;
addStudent(name, email, password, collegeId);
