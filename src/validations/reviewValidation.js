const validateReview = (req, res, next) => {
  const { review, rating } = req.body;
  const errors = [];

  if (!review || typeof review !== 'string' || review.trim().length === 0) {
    errors.push('Review text is required and must be a string');
  }

  if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
    errors.push('Rating is required and must be a number between 1 and 5');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      errors
    });
  }

  next();
};

module.exports = {
  validateReview
};
