const express = require('express');
const playlistController = require('../controllers/playlistController');
const authController = require('../controllers/authController');
const { validatePlaylist } = require('../validations/playlistValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: Управління плейлистами
 */

/**
 * @swagger
 * /api/v1/playlists:
 *   get:
 *     summary: Отримати всі плейлисти
 *     tags: [Playlists]
 *     responses:
 *       200:
 *         description: Список плейлистів
 *   post:
 *     summary: Створити новий плейлист
 *     tags: [Playlists]
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
 *                 example: My Favorite Tracks
 *               description:
 *                 type: string
 *                 example: A collection of my favorite music
 *               tracks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64a1b2c3d4e5f67890123456"]
 *     responses:
 *       201:
 *         description: Плейлист створено
 */
router
  .route('/')
  .get(playlistController.getAllPlaylists)
  .post(authController.protect, validatePlaylist, playlistController.createPlaylist);

/**
 * @swagger
 * /api/v1/playlists/{id}:
 *   get:
 *     summary: Отримати плейлист за ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані плейлиста
 *   patch:
 *     summary: Оновити плейлист
 *     tags: [Playlists]
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
 *               description:
 *                 type: string
 *               tracks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Плейлист оновлено
 *   delete:
 *     summary: Видалити плейлист
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Плейлист видалено
 */
router
  .route('/:id')
  .get(playlistController.getPlaylist)
  .patch(authController.protect, playlistController.updatePlaylist)
  .delete(authController.protect, playlistController.deletePlaylist);

module.exports = router;
