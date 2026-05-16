const Artist = require('../models/Artist');
const fs = require('fs');
const path = require('path');
const TemplateEngine = require('../utils/templateEngine');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createArtist = catchAsync(async (req, res, next) => { 
  const artist = await Artist.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { artist }
  });
});

exports.getAllArtists = catchAsync(async (req, res, next) => { 
  const features = new APIFeatures(Artist.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const artists = await features.query;

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const cardTemplate = fs.readFileSync(path.join(__dirname, '../views/partials/artistCard.html'), 'utf8');

    let artistCards;
    if (artists.length > 0) {
      artistCards = artists.map(artist => {
        let card = cardTemplate;
        card = card.replace(/{{id}}/g, artist._id);
        card = card.replace(/{{name}}/g, artist.name);
        card = card.replace(/{{genre}}/g, artist.genre ? artist.genre.join(', ') : '');
        return card;
      }).join('');
    } else {
      artistCards = '<div class="no-data">No artists found...</div>';
    }

    const html = TemplateEngine.render('artists', {
      TITLE: 'Artists',
      TYPE_LABEL: 'artist',
      CONTENT: artistCards
    });

    return res.send(html);
  }

  res.status(200).json({
    status: 'success',
    results: artists.length,
    data: { artists }
  });
});

exports.getArtist = catchAsync(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) return next(new AppError('Artist not found', 404));
  res.status(200).json({ status: 'success', data: { artist } });
});

exports.updateArtist = catchAsync(async (req, res, next) => {
  const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!artist) return next(new AppError('Artist not found', 404));
  res.status(200).json({ status: 'success', data: { artist } });
});

exports.deleteArtist = catchAsync(async (req, res, next) => {
  const artist = await Artist.findByIdAndDelete(req.params.id);
  if (!artist) return next(new AppError('Artist not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
