const validateTrack = (req, res, next) => {
  const { title, artist, duration } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Track title is required and must be a string');
  }

  if (!artist || typeof artist !== 'string' || artist.trim().length === 0) {
    errors.push('Artist is required and must be a string');
  }

  if (duration !== undefined && (typeof duration !== 'number' || isNaN(duration))) {
    errors.push('Duration must be a number (seconds)');
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
  validateTrack
};
