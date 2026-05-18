const express = require('express');
const audiobookController = require('../controllers/audiobookController');
const authController = require('../controllers/authController');
const { validateAudiobook } = require('../validations/audiobookValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Audiobooks
 *   description: Управління аудіокнигами
 */

/**
 * @swagger
 * /api/v1/audiobooks:
 *   get:
 *     summary: Отримати всі аудіокниги
 *     tags: [Audiobooks]
 *     responses:
 *       200:
 *         description: Список аудіокниг
 *   post:
 *     summary: Створити нову аудіокнигу
 *     tags: [Audiobooks]
 *     responses:
 *       201:
 *         description: Аудіокнигу створено
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
 *     tags: [Audiobooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані аудіокниги
 *   patch:
 *     summary: Оновити аудіокнигу
 *     tags: [Audiobooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Аудіокнигу оновлено
 *   delete:
 *     summary: Видалити аудіокнигу
 *     tags: [Audiobooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
