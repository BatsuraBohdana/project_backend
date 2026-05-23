const validateAlbum = (req, res, next) => {
  const { title, artist } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Album title is required and must be a string');
  }

  if (!artist || typeof artist !== 'string' || artist.trim().length === 0) {
    errors.push('Artist ID is required and must be a string');
  } else if (artist.length !== 24) {
    errors.push('Artist ID must be a valid 24-character hexadecimal string');
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
  validateAlbum
};
