const Album = require('../models/Album');
const fs = require('fs');
const path = require('path');
const TemplateEngine = require('../utils/templateEngine');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createAlbum = catchAsync(async (req, res, next) => { 
  const album = await Album.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { album }
  });
});

exports.getAllAlbums = catchAsync(async (req, res, next) => { 
  const features = new APIFeatures(Album.find().populate('artist'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const albums = await features.query;

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const cardTemplate = fs.readFileSync(path.join(__dirname, '../views/partials/albumCard.html'), 'utf8');

    let albumCards;
    if (albums.length > 0) {
      albumCards = albums.map(album => {
        let card = cardTemplate;
        card = card.replace(/{{id}}/g, album._id);
        card = card.replace(/{{title}}/g, (album.title || 'Unknown').replace(/"/g, '&quot;'));
        card = card.replace(/{{artistName}}/g, album.artist ? album.artist.name.replace(/"/g, '&quot;') : 'Unknown Artist');
        card = card.replace(/{{genre}}/g, album.genre ? album.genre.map(g => `<span class="tag">${g}</span>`).join('') : '');
        return card;
      }).join('');
    } else {
      albumCards = '<div class="no-data">No albums found...</div>';
    }

    const html = TemplateEngine.render('albums', {
      TITLE: 'Albums',
      TYPE_LABEL: 'album',
      CONTENT: albumCards
    });

    return res.send(html);
  }

  res.status(200).json({
    status: 'success',
    results: albums.length,
    data: { albums }
  });
});

exports.getAlbum = catchAsync(async (req, res, next) => {
  const album = await Album.findById(req.params.id).populate('artist');
  if (!album) return next(new AppError('Album not found', 404));
  res.status(200).json({ status: 'success', data: { album } });
});

exports.updateAlbum = catchAsync(async (req, res, next) => {
  const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!album) return next(new AppError('Album not found', 404));
  res.status(200).json({ status: 'success', data: { album } });
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
  const album = await Album.findByIdAndDelete(req.params.id);
  if (!album) return next(new AppError('Album not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
