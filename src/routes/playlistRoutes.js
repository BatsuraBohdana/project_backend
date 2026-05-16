const express = require('express');
const playlistController = require('../controllers/playlistController');
const authController = require('../controllers/authController');

const router = express.Router();




router
  .route('/')
  .get(playlistController.getAllPlaylists)
  .post(authController.protect, playlistController.createPlaylist);


router
  .route('/:id')
  .get(playlistController.getPlaylist)
  .patch(authController.protect, playlistController.updatePlaylist)
  .delete(authController.protect, playlistController.deletePlaylist);

module.exports = router;
