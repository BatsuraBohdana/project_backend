const express = require('express');
const podcastController = require('../controllers/podcastController');
const authController = require('../controllers/authController');
const { validatePodcast } = require('../validations/podcastValidation');

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Joe Rogan Experience
 *               host:
 *                 type: string
 *                 example: Joe Rogan
 *               description:
 *                 type: string
 *                 example: A long-form conversation hosted by Joe Rogan
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["comedy", "politics"]
 *               duration:
 *                 type: number
 *                 example: 7200
 *               episodeCount:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       201:
 *         description: Подкаст створено
 */
router
  .route('/')
  .get(podcastController.getAllPodcasts)
  .post(authController.protect, validatePodcast, podcastController.createPodcast);

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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               host:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: number
 *               episodeCount:
 *                 type: number
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
