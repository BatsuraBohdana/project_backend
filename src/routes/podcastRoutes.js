const express = require('express');
const podcastController = require('../controllers/podcastController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Podcast:
 *       type: object
 *       required:
 *         - title
 *         - host
 *       properties:
 *         title:
 *           type: string
 *         host:
 *           type: string
 *         description:
 *           type: string
 *         coverImage:
 *           type: string
 *         category:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/podcasts:
 *   get:
 *     summary: Отримати всі подкасти
 *     tags: [Подкасти]
 *     responses:
 *       200:
 *         description: Список подкастів
 *   post:
 *     summary: Додати новий подкаст
 *     tags: [Подкасти]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Podcast'
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
 *     tags: [Подкасти]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID подкасту
 *     responses:
 *       200:
 *         description: Дані подкасту
 *   patch:
 *     summary: Оновити подкаст
 *     tags: [Подкасти]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID подкасту
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Podcast'
 *     responses:
 *       200:
 *         description: Подкаст оновлено
 *   delete:
 *     summary: Видалити подкаст
 *     tags: [Подкасти]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID подкасту
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
