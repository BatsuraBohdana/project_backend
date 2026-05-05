const express = require('express');
const trackController = require('../controllers/trackController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tracks:
 *   get:
 *     summary: Отримати всі треки
 *     tags: [Tracks]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Фільтрація за тегами (через кому)
 *     responses:
 *       200:
 *         description: Список треків
 *   post:
 *     summary: Додати новий трек
 *     tags: [Tracks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       201:
 *         description: Трек створено
 */
router
  .route('/')
  .get(trackController.getAllTracks)
  .post(trackController.createTrack);

/**
 * @swagger
 * /api/v1/tracks/export:
 *   get:
 *     summary: Експортувати всі треки у файл JSON
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Файл завантажено
 */
router.get('/export', trackController.exportTracks);

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
 *     summary: Оновити дані треку
 *     tags: [Tracks]
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
 *             $ref: '#/components/schemas/Track'
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
