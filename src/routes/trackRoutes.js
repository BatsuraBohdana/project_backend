const express = require('express');
const trackController = require('../controllers/trackController');
const { validateTrack } = require('../validations/trackValidation');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Track:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *       properties:
 *         title:
 *           type: string
 *         artist:
 *           type: string
 *         album:
 *           type: string
 *         duration:
 *           type: number
 *         url:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/v1/tracks:
 *   get:
 *     summary: Отримати всі треки
 *     tags: [Треки]
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
 *     tags: [Треки]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       201:
 *         description: Трек додано
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
 *     tags: [Треки]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID треку
 *     responses:
 *       200:
 *         description: Дані треку
 *   patch:
 *     summary: Оновити дані треку
 *     tags: [Треки]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID треку
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
 *     tags: [Треки]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID треку
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
