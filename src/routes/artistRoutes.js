const express = require('express');
const artistController = require('../controllers/artistController');
const authController = require('../controllers/authController');
const { validateArtist } = require('../validations/artistValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: Управління виконавцями
 */

/**
 * @swagger
 * /api/v1/artists:
 *   get:
 *     summary: Отримати всіх виконавців
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Список виконавців
 *   post:
 *     summary: Створити нового артиста
 *     tags: [Artists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Queen
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Rock", "Hard Rock"]
 *               bio:
 *                 type: string
 *                 example: Queen are a British rock band formed in London in 1970.
 *               photo:
 *                 type: string
 *                 example: https://example.com/artist.jpg
 *     responses:
 *       201:
 *         description: Артиста створено
 */
 router
 .route('/')
 .get(artistController.getAllArtists)
 .post(authController.protect, validateArtist, artistController.createArtist);

 /**
 * @swagger
 * /api/v1/artists/{id}:
 *   get:
 *     summary: Отримати артиста за ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані артиста
 *   patch:
 *     summary: Оновити артиста
 *     tags: [Artists]
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
 *               name:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Артиста оновлено
 *   delete:
 *     summary: Видалити виконавця
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Виконавця видалено
 */
router
  .route('/:id')
  .get(artistController.getArtist)
  .patch(authController.protect, artistController.updateArtist)
  .delete(authController.protect, artistController.deleteArtist);

module.exports = router;
