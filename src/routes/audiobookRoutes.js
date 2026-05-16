const express = require('express');
const audiobookController = require('../controllers/audiobookController');
const authController = require('../controllers/authController');
const { validateAudiobook } = require('../validations/audiobookValidation');

const router = express.Router();

router
  .route('/')
  .get(audiobookController.getAllAudiobooks)
  .post(authController.protect, validateAudiobook, audiobookController.createAudiobook);

router
  .route('/:id')
  .get(audiobookController.getAudiobook)
  .patch(authController.protect, audiobookController.updateAudiobook)
  .delete(authController.protect, audiobookController.deleteAudiobook);

module.exports = router;
