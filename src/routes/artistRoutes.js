const express = require('express');
const artistController = require('../controllers/artistController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Artist:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Artist name
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *         bio:
 *           type: string
 *         photo:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/artists:
 *   get:
 *     summary: Отримати всіх артистів
 *     tags: [Артисти]
 *     responses:
 *       200:
 *         description: Список артистів
 *   post:
 *     summary: Створити нового артиста
 *     tags: [Артисти]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artist'
 *     responses:
 *       201:
 *         description: Артиста створено
 */
router
  .route('/')
  .get(artistController.getAllArtists)
  .post(authController.protect, artistController.createArtist);

/**
 * @swagger
 * /api/v1/artists/{id}:
 *   get:
 *     summary: Отримати артиста за ID
 *     tags: [Артисти]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID артиста
 *     responses:
 *       200:
 *         description: Дані артиста
 *   patch:
 *     summary: Оновити дані артиста
 *     tags: [Артисти]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID артиста
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artist'
 *     responses:
 *       200:
 *         description: Дані оновлено
 *   delete:
 *     summary: Видалити артиста
 *     tags: [Артисти]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID артиста
 *     responses:
 *       204:
 *         description: Артиста видалено
 */
router
  .route('/:id')
  .get(artistController.getArtist)
  .patch(authController.protect, artistController.updateArtist)
  .delete(authController.protect, artistController.deleteArtist);

module.exports = router;
