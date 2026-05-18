const express = require('express');
const playlistController = require('../controllers/playlistController');
const authController = require('../controllers/authController');

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
 *     responses:
 *       201:
 *         description: Плейлист створено
 */
router
  .route('/')
  .get(playlistController.getAllPlaylists)
  .post(authController.protect, playlistController.createPlaylist);

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
