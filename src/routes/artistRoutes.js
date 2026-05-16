const express = require('express');
const artistController = require('../controllers/artistController');
const authController = require('../controllers/authController');

const router = express.Router();




router
  .route('/')
  .get(artistController.getAllArtists)
  .post(authController.protect, artistController.createArtist);


router
  .route('/:id')
  .get(artistController.getArtist)
  .patch(authController.protect, artistController.updateArtist)
  .delete(authController.protect, artistController.deleteArtist);

module.exports = router;
