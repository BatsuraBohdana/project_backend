const express = require('express');
const podcastController = require('../controllers/podcastController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Podcasts
 *   description: Управління подкастами
 */

/**
 * @swagger
 * /api/v1/podcasts:
 *   get:
 *     summary: Отримати всі подкасти
 *     tags: [Podcasts]
 *     responses:
 *       200:
 *         description: Список подкастів
 *   post:
 *     summary: Створити новий подкаст
 *     tags: [Podcasts]
 *     responses:
 *       201:
 *         description: Подкаст створено
 */
router
  .route('/')
  .get(podcastController.getAllPodcasts)
  .post(authController.protect, podcastController.createPodcast);

/**
 * @swagger
 * /api/v1/podcasts/{id}:
 *   get:
 *     summary: Отримати подкаст за ID
 *     tags: [Podcasts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані подкасту
 *   patch:
 *     summary: Оновити подкаст
 *     tags: [Podcasts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Подкаст оновлено
 *   delete:
 *     summary: Видалити подкаст
 *     tags: [Podcasts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Подкаст видалено
 */
router
  .route('/:id')
  .get(podcastController.getPodcast)
  .patch(authController.protect, podcastController.updatePodcast)
  .delete(authController.protect, podcastController.deletePodcast);

module.exports = router;
