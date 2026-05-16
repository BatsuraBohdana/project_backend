const Track = require('../models/Track');
const fs = require('fs');
const path = require('path');
const TemplateEngine = require('../utils/templateEngine');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createTrack = catchAsync(async (req, res, next) => { 
  const track = await Track.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { track }
  });
});

exports.getAllTracks = catchAsync(async (req, res, next) => { 
  const features = new APIFeatures(Track.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tracks = await features.query;

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const cardTemplate = fs.readFileSync(path.join(__dirname, '../views/partials/trackCard.html'), 'utf8');

    let trackCards;
    if (tracks.length > 0) {
      trackCards = tracks.map(track => {
        let card = cardTemplate;
        card = card.replace(/{{id}}/g, track._id);
        card = card.replace(/{{title}}/g, (track.title || 'Unknown').replace(/"/g, '&quot;'));
        card = card.replace(/{{artist}}/g, (track.artist || 'Unknown').replace(/"/g, '&quot;'));
        card = card.replace(/{{album}}/g, (track.album || '').replace(/"/g, '&quot;'));
        card = card.replace(/{{tags}}/g, track.tags ? track.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '');
        return card;
      }).join('');
    } else {
      trackCards = '<div class="no-data">Nothing here yet...</div>';
    }

    const html = TemplateEngine.render('tracks', {
      TITLE: 'Music Collection',
      TYPE_LABEL: 'track',
      CONTENT: trackCards
    });

    return res.send(html);
  }

  res.status(200).json({
    status: 'success',
    results: tracks.length,
    data: { tracks }
  });
});

exports.getTrack = catchAsync(async (req, res, next) => {
  const track = await Track.findById(req.params.id);
  if (!track) {
    return next(new AppError('Track not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { track }
  });
});

exports.updateTrack = catchAsync(async (req, res, next) => {
  const track = await Track.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!track) {
    return next(new AppError('Track not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { track }
  });
});

exports.deleteTrack = catchAsync(async (req, res, next) => {
  const track = await Track.findByIdAndDelete(req.params.id);
  if (!track) {
    return next(new AppError('Track not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
