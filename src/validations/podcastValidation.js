const validatePodcast = (req, res, next) => {
  const { title } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Podcast title is required and must be a string');
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
  validatePodcast
};
