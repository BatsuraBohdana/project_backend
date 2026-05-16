const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Album:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *       properties:
 *         title:
 *           type: string
 *         artist:
 *           type: string
 *           description: Artist ID
 *         releaseDate:
 *           type: string
 *           format: date
 *         coverImage:
 *           type: string
 *         genre:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/v1/albums:
 *   get:
 *     summary: Отримати всі альбоми
 *     tags: [Альбоми]
 *     responses:
 *       200:
 *         description: Список альбомів
 *   post:
 *     summary: Створити новий альбом
 *     tags: [Альбоми]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Album'
 *     responses:
 *       201:
 *         description: Альбом створено
 */
router
  .route('/')
  .get(albumController.getAllAlbums)
  .post(authController.protect, albumController.createAlbum);

/**
 * @swagger
 * /api/v1/albums/{id}:
 *   get:
 *     summary: Отримати альбом за ID
 *     tags: [Альбоми]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID альбому
 *     responses:
 *       200:
 *         description: Дані альбому
 *   patch:
 *     summary: Оновити альбом
 *     tags: [Альбоми]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID альбому
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Album'
 *     responses:
 *       200:
 *         description: Альбом оновлено
 *   delete:
 *     summary: Видалити альбом
 *     tags: [Альбоми]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID альбому
 *     responses:
 *       204:
 *         description: Альбом видалено
 */
router
  .route('/:id')
  .get(albumController.getAlbum)
  .patch(authController.protect, albumController.updateAlbum)
  .delete(authController.protect, albumController.deleteAlbum);

module.exports = router;
