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
      required: true,
      enum: ['article', 'video', 'audio', 'pdf', 'guide', 'helpline', 'other'],
    },
    link: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: false, // Optional: for uploaded files
    },
    fileName: {
      type: String,
      required: false, // Original file name
    },
    fileSize: {
      type: Number,
      required: false, // File size in bytes
    },
    isUploaded: {
      type: Boolean,
      default: false, // true if file is uploaded, false if external link
    },
    embedding: {
      type: [Number],
      select: false, // never sent to clients, only used server-side for retrieval
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
