const validatePlaylist = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Playlist name is required and must be a string');
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
  validatePlaylist
};
