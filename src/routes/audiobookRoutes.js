const express = require('express');
const audiobookController = require('../controllers/audiobookController');
const authController = require('../controllers/authController');
const { validateAudiobook } = require('../validations/audiobookValidation');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Audiobook:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         narrator:
 *           type: string
 *         duration:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/v1/audiobooks:
 *   get:
 *     summary: Отримати всі аудіокниги
 *     tags: [Аудіокниги]
 *     responses:
 *       200:
 *         description: Список аудіокниг
 *   post:
 *     summary: Додати нову аудіокнигу
 *     tags: [Аудіокниги]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audiobook'
 *     responses:
 *       201:
 *         description: Аудіокнигу додано
 */
router
  .route('/')
  .get(audiobookController.getAllAudiobooks)
  .post(authController.protect, validateAudiobook, audiobookController.createAudiobook);

/**
 * @swagger
 * /api/v1/audiobooks/{id}:
 *   get:
 *     summary: Отримати аудіокнигу за ID
 *     tags: [Аудіокниги]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID аудіокниги
 *     responses:
 *       200:
 *         description: Дані аудіокниги
 *   patch:
 *     summary: Оновити аудіокнигу
 *     tags: [Аудіокниги]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID аудіокниги
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audiobook'
 *     responses:
 *       200:
 *         description: Дані оновлено
 *   delete:
 *     summary: Видалити аудіокнигу
 *     tags: [Аудіокниги]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID аудіокниги
 *     responses:
 *       204:
 *         description: Аудіокнигу видалено
 */
router
  .route('/:id')
  .get(audiobookController.getAudiobook)
  .patch(authController.protect, audiobookController.updateAudiobook)
  .delete(authController.protect, audiobookController.deleteAudiobook);

module.exports = router;
