const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['stress', 'anxiety', 'depression', 'sleep', 'exam'],
      required: true,
    },
    link: {
      type: String, // URL to article / video / PDF
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
