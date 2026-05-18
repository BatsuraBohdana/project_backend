const express = require('express');
const artistController = require('../controllers/artistController');
const authController = require('../controllers/authController');

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
 *     summary: Додати нового виконавця
 *     tags: [Artists]
 *     responses:
 *       201:
 *         description: Виконавця додано
 */
router
  .route('/')
  .get(artistController.getAllArtists)
  .post(authController.protect, artistController.createArtist);

/**
 * @swagger
 * /api/v1/artists/{id}:
 *   get:
 *     summary: Отримати виконавця за ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані виконавця
 *   patch:
 *     summary: Оновити дані виконавця
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані виконавця оновлено
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
