const Playlist = require('../models/Playlist');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const fs = require('fs');
const path = require('path');
const TemplateEngine = require('../utils/templateEngine');

exports.createPlaylist = catchAsync(async (req, res, next) => { 
  const playlist = await Playlist.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { playlist }
  });
});

exports.getAllPlaylists = catchAsync(async (req, res, next) => { 
  const playlists = await Playlist.find().populate('tracks');

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const cardTemplate = fs.readFileSync(path.join(__dirname, '../views/partials/playlistCard.html'), 'utf8');

    let playlistCards;
    if (playlists.length > 0) {
      playlistCards = playlists.map(playlist => {
        let card = cardTemplate;
        card = card.replace(/{{id}}/g, playlist._id);
        card = card.replace(/{{name}}/g, (playlist.name || 'Unnamed').replace(/"/g, '&quot;'));
        card = card.replace(/{{description}}/g, (playlist.description || 'No description').replace(/"/g, '&quot;'));
        card = card.replace(/{{trackCount}}/g, playlist.tracks ? playlist.tracks.length : 0);
        return card;
      }).join('');
    } else {
      playlistCards = '<div class="no-data">You haven\'t created any playlists yet.</div>';
    }

    const html = TemplateEngine.render('playlists', {
      TITLE: 'Your Playlists',
      TYPE_LABEL: 'playlist',
      CONTENT: playlistCards
    });

    return res.send(html);
  }

  res.status(200).json({
    status: 'success',
    results: playlists.length,
    data: { playlists }
  });
});

exports.getPlaylist = catchAsync(async (req, res, next) => {
  const playlist = await Playlist.findById(req.params.id).populate('tracks');
  if (!playlist) {
    return next(new AppError('Playlist not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { playlist }
  });
});

exports.updatePlaylist = catchAsync(async (req, res, next) => {
  const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!playlist) {
    return next(new AppError('Playlist not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { playlist }
  });
});

exports.deletePlaylist = catchAsync(async (req, res, next) => {
  const playlist = await Playlist.findByIdAndDelete(req.params.id);
  if (!playlist) {
    return next(new AppError('Playlist not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
