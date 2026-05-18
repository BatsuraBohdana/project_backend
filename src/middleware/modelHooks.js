
exports.trimTrackTitle = function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  next();
};

exports.logNewTrack = function (doc) {
  console.log(`Новий трек створено: ${doc.title} від ${doc.artist}`);
};

exports.logNewAlbum = function (doc) {
  console.log(`Новий альбом створено: ${doc.title}`);
};

exports.populateReviewUser = function (next) {
  this.populate({
    path: 'user',
    select: 'username'
  });
  next();
};

exports.hashPassword = async function (next) {
  if (!this.isModified('password')) return next();
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
};
