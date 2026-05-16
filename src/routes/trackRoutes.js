const express = require('express');
const trackController = require('../controllers/trackController');
const { validateTrack } = require('../validations/trackValidation');
const router = express.Router();




router
  .route('/')
  .get(trackController.getAllTracks)
  .post(validateTrack, trackController.createTrack);


router
  .route('/:id')
  .get(trackController.getTrack)
  .patch(trackController.updateTrack)
  .delete(trackController.deleteTrack);

module.exports = router;
