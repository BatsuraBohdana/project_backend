const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');
const TemplateEngine = require('../utils/templateEngine');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createReview = catchAsync(async (req, res, next) => { 
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { review }
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => { 
  const features = new APIFeatures(Review.find().populate('user'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const cardTemplate = fs.readFileSync(path.join(__dirname, '../views/partials/reviewCard.html'), 'utf8');

    let reviewCards;
    if (reviews.length > 0) {
      reviewCards = reviews.map(rev => {
        let card = cardTemplate;
        const reviewText = (rev.review || '').replace(/"/g, '&quot;');
        const userName = (rev.user && rev.user.username ? rev.user.username : 'Anonymous').replace(/"/g, '&quot;');

        card = card.replace(/{{id}}/g, rev._id);
        card = card.replace(/{{review}}/g, reviewText);
        card = card.replace(/{{rating}}/g, rev.rating || 0);
        card = card.replace(/{{userName}}/g, userName);
        return card;
      }).join('');
    } else {
      reviewCards = '<div class="no-data">No reviews yet...</div>';
    }

    const html = TemplateEngine.render('reviews', {
      TITLE: 'Reviews',
      TYPE_LABEL: 'review',
      CONTENT: reviewCards
    });

    return res.send(html);
  }

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found', 404));
  res.status(200).json({ status: 'success', data: { review } });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!review) return next(new AppError('Review not found', 404));
  res.status(200).json({ status: 'success', data: { review } });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return next(new AppError('Review not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
