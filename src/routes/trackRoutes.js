const express = require('express');
const trackController = require('../controllers/trackController');
const { validateTrack } = require('../validations/trackValidation');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tracks
 *   description: Управління музичними треками
 */

/**
 * @swagger
 * /api/v1/tracks:
 *   get:
 *     summary: Отримати всі треки
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Список треків
 *   post:
 *     summary: Створити новий трек
 *     tags: [Tracks]
 *     responses:
 *       201:
 *         description: Трек створено
 */
router
  .route('/')
  .get(trackController.getAllTracks)
  .post(validateTrack, trackController.createTrack);

/**
 * @swagger
 * /api/v1/tracks/{id}:
 *   get:
 *     summary: Отримати трек за ID
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані треку
 *   patch:
 *     summary: Оновити трек
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Трек оновлено
 *   delete:
 *     summary: Видалити трек
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Трек видалено
 */
router
  .route('/:id')
  .get(trackController.getTrack)
  .patch(trackController.updateTrack)
  .delete(trackController.deleteTrack);

module.exports = router;
