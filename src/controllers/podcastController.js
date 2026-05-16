const Podcast = require('../models/Podcast');
const fs = require('fs');
const path = require('path');
const TemplateEngine = require('../utils/templateEngine');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createPodcast = catchAsync(async (req, res, next) => {
  const podcast = await Podcast.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { podcast }
  });
});

exports.getAllPodcasts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Podcast.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const podcasts = await features.query;

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const cardTemplate = fs.readFileSync(path.join(__dirname, '../views/partials/podcastCard.html'), 'utf8');

    let podcastCards;
    if (podcasts.length > 0) {
      podcastCards = podcasts.map(pod => {
        let card = cardTemplate;
        card = card.replace(/{{id}}/g, pod._id);
        card = card.replace(/{{title}}/g, (pod.title || 'Unknown').replace(/"/g, '&quot;'));
        card = card.replace(/{{host}}/g, (pod.host || 'Unknown Host').replace(/"/g, '&quot;'));
        card = card.replace(/{{tags}}/g, pod.tags ? pod.tags.map(t => `<span class="tag">${t}</span>`).join('') : '');
        return card;
      }).join('');
    } else {
      podcastCards = '<div class="no-data">No podcasts found...</div>';
    }

    const html = TemplateEngine.render('podcasts', {
      TITLE: 'Podcasts',
      TYPE_LABEL: 'podcast',
      CONTENT: podcastCards
    });

    return res.send(html);
  }

  res.status(200).json({
    status: 'success',
    results: podcasts.length,
    data: { podcasts }
  });
});

exports.getPodcast = catchAsync(async (req, res, next) => {
  const podcast = await Podcast.findById(req.params.id);
  if (!podcast) return next(new AppError('Podcast not found', 404));
  res.status(200).json({ status: 'success', data: { podcast } });
});

exports.updatePodcast = catchAsync(async (req, res, next) => {
  const podcast = await Podcast.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!podcast) return next(new AppError('Podcast not found', 404));
  res.status(200).json({ status: 'success', data: { podcast } });
});

exports.deletePodcast = catchAsync(async (req, res, next) => {
  const podcast = await Podcast.findByIdAndDelete(req.params.id);
  if (!podcast) return next(new AppError('Podcast not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
