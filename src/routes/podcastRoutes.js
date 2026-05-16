const express = require('express');
const podcastController = require('../controllers/podcastController');
const authController = require('../controllers/authController');

const router = express.Router();




router
  .route('/')
  .get(podcastController.getAllPodcasts)
  .post(authController.protect, podcastController.createPodcast);


router
  .route('/:id')
  .get(podcastController.getPodcast)
  .patch(authController.protect, podcastController.updatePodcast)
  .delete(authController.protect, podcastController.deletePodcast);

module.exports = router;
