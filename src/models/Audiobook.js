const mongoose = require('mongoose');

const audiobookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Audiobook title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  narrator: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Audiobook', audiobookSchema);
