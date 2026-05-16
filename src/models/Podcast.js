const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Podcast title is required'],
    trim: true
  },
  host: String,
  description: String,
  tags: [String],
  duration: Number,
  episodeCount: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
