const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const { validateReview } = require('../validations/reviewValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Управління відгуками
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Отримати всі відгуки
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Список відгуків
 *   post:
 *     summary: Створити новий відгук
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *               - user
 *             properties:
 *               review:
 *                 type: string
 *                 example: Amazing track!
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               user:
 *                 type: string
 *                 description: ID of the user
 *                 example: 64a1b2c3d4e5f67890123456
 *               track:
 *                 type: string
 *                 description: ID of the track
 *                 example: 64a1b2c3d4e5f67890123456
 *               album:
 *                 type: string
 *                 description: ID of the album
 *                 example: 64a1b2c3d4e5f67890123456
 *     responses:
 *       201:
 *         description: Відгук створено
 */
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, validateReview, reviewController.createReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Отримати відгук за ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані відгуку
 *   patch:
 *     summary: Оновити відгук
 *     tags: [Reviews]
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
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Відгук оновлено
 *   delete:
 *     summary: Видалити відгук
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Відгук видалено
 */
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
