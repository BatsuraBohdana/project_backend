const express = require('express');
const playlistController = require('../controllers/playlistController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         tracks:
 *           type: array
 *           items:
 *             type: string
 *             description: Track ID
 */

/**
 * @swagger
 * /api/v1/playlists:
 *   get:
 *     summary: Отримати всі плейлисти
 *     tags: [Плейлисти]
 *     responses:
 *       200:
 *         description: Список плейлистів
 *   post:
 *     summary: Створити новий плейлист
 *     tags: [Плейлисти]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Playlist'
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
 *     tags: [Плейлисти]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID плейлиста
 *     responses:
 *       200:
 *         description: Дані плейлиста
 *   patch:
 *     summary: Оновити плейлист
 *     tags: [Плейлисти]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID плейлиста
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Playlist'
 *     responses:
 *       200:
 *         description: Плейлист оновлено
 *   delete:
 *     summary: Видалити плейлист
 *     tags: [Плейлисти]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID плейлиста
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
