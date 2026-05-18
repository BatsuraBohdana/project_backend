const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: Управління альбомами
 */

/**
 * @swagger
 * /api/v1/albums:
 *   get:
 *     summary: Отримати всі альбоми
 *     tags: [Albums]
 *     responses:
 *       200:
 *         description: Список альбомів
 *   post:
 *     summary: Створити новий альбом
 *     tags: [Albums]
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
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані альбому
 *   patch:
 *     summary: Оновити дані альбому
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Альбом оновлено
 *   delete:
 *     summary: Видалити альбом
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
