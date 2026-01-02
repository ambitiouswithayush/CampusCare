const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const resetAllPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    // Get all users
    const allUsers = await User.find({});
    console.log(`📋 Found ${allUsers.length} users\n`);

    let count = 0;
    for (const user of allUsers) {
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      console.log(`✅ Reset: ${user.email} (${user.role})`);
      count++;
    }

    console.log(`\n🎉 Successfully reset passwords for ${count} users`);
    console.log('All users now have password: password\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

resetAllPasswords();
