const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Artist must have a name'],
    unique: true,
    trim: true
  },
  genre: [String],
  bio: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
