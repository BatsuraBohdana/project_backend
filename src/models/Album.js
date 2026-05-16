const mongoose = require('mongoose');
const { logNewAlbum } = require('../middleware/modelHooks');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album title is required'],
    trim: true
  },
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Artist',
    required: [true, 'Album must belong to an artist']
  },
  releaseDate: Date,
  coverImage: String,
  genre: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

albumSchema.post('save', logNewAlbum);

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
