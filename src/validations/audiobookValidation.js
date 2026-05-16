const validateAudiobook = (req, res, next) => {
  const { title, author, duration } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Audiobook title is required and must be a string');
  }

  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    errors.push('Author is required and must be a string');
  }

  if (duration !== undefined && (typeof duration !== 'number' || isNaN(duration))) {
    errors.push('Duration must be a number (seconds)');
  }

  if (errors.length > 0) {
    return res.status(400).json({ status: 'fail', errors });
  }

  next();
};

module.exports = { validateAudiobook };
