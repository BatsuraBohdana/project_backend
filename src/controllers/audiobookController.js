const Audiobook = require('../models/Audiobook');
const TemplateEngine = require('../utils/templateEngine');
const fs = require('fs');
const path = require('path');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllAudiobooks = catchAsync(async (req, res, next) => { // eslint-disable-line
  const features = new APIFeatures(Audiobook.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const audiobooks = await features.query;

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const cardTemplate = fs.readFileSync(path.join(__dirname, '../views/partials/audiobookCard.html'), 'utf8');

    let audiobookCards;
    if (audiobooks.length > 0) {
      audiobookCards = audiobooks.map(book => {
        let card = cardTemplate;
        card = card.replace(/{{id}}/g, book._id);
        card = card.replace(/{{title}}/g, (book.title || 'Unknown').replace(/"/g, '&quot;'));
        card = card.replace(/{{author}}/g, (book.author || 'Unknown').replace(/"/g, '&quot;'));
        card = card.replace(/{{narrator}}/g, (book.narrator || '').replace(/"/g, '&quot;'));
        card = card.replace(/{{tags}}/g, book.tags ? book.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '');
        return card;
      }).join('');
    } else {
      audiobookCards = '<div class="no-data">No audiobooks yet...</div>';
    }

    const html = TemplateEngine.render('audiobooks', {
      TITLE: 'Audio Library',
      TYPE_LABEL: 'book',
      CONTENT: audiobookCards
    });
    return res.send(html);
  }

  res.status(200).json({
    status: 'success',
    results: audiobooks.length,
    data: { audiobooks }
  });
});

exports.createAudiobook = catchAsync(async (req, res, next) => { // eslint-disable-line
  const audiobook = await Audiobook.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { audiobook }
  });
});

exports.getAudiobook = catchAsync(async (req, res, next) => {
  const audiobook = await Audiobook.findById(req.params.id);
  if (!audiobook) {
    return next(new AppError('Audiobook not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { audiobook }
  });
});

exports.updateAudiobook = catchAsync(async (req, res, next) => {
  const audiobook = await Audiobook.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!audiobook) {
    return next(new AppError('Audiobook not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { audiobook }
  });
});

exports.deleteAudiobook = catchAsync(async (req, res, next) => {
  const audiobook = await Audiobook.findByIdAndDelete(req.params.id);
  if (!audiobook) {
    return next(new AppError('Audiobook not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
