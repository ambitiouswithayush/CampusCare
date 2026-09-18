const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'doctor'],
      default: 'student',
    },
    collegeId: {
      type: String,
      required: function() {
        return this.role === 'student';
      },
      trim: true,
    },
    // Doctor-only: concern areas used for smart appointment matching
    specialization: {
      type: [String],
      enum: ['anxiety', 'depression', 'stress', 'career', 'relationships', 'academic', 'general'],
      default: undefined,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
