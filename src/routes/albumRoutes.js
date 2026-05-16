const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');

const router = express.Router();




router
  .route('/')
  .get(albumController.getAllAlbums)
  .post(authController.protect, albumController.createAlbum);


router
  .route('/:id')
  .get(albumController.getAlbum)
  .patch(authController.protect, albumController.updateAlbum)
  .delete(authController.protect, albumController.deleteAlbum);

module.exports = router;
