const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['Great', 'Okay', 'Down', 'Anxious'],
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      maxlength: 500,
    },
    // 1-10 self-reported intensity, used by the crisis-detection pipeline.
    // Falls back to a mood-based estimate if the student doesn't set one.
    intensity: {
      type: Number,
      min: 1,
      max: 10,
    },
    triggeredActions: [
      {
        type: String,
        // Track which suggestions they clicked
        // e.g., "chat", "appointments", "resources", "community"
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
moodSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Mood', moodSchema);
