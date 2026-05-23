const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');
const { validateAlbum } = require('../validations/albumValidation');

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *             properties:
 *               title:
 *                 type: string
 *                 example: A Night at the Opera
 *               artist:
 *                 type: string
 *                 description: ID of the artist
 *                 example: 64a1b2c3d4e5f67890123456
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Rock", "Opera"]
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: 1975-11-21
 *               coverImage:
 *                 type: string
 *                 example: https://example.com/cover.jpg
 *     responses:
 *       201:
 *         description: Альбом створено
 */
 router
 .route('/')
 .get(albumController.getAllAlbums)
 .post(authController.protect, validateAlbum, albumController.createAlbum);

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
 *     summary: Оновити альбом
 *     tags: [Albums]
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
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               coverImage:
 *                 type: string
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
