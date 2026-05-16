const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Track title is required'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist is required'],
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    min: 0
  },
  tags: {
    type: [String],
    default: []
  },
  url: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

trackSchema.index({ tags: 1 });
trackSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Track', trackSchema);
