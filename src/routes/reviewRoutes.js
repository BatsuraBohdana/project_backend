const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - review
 *         - user
 *       properties:
 *         review:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         user:
 *           type: string
 *           description: User ID
 *         track:
 *           type: string
 *           description: Track ID
 *         album:
 *           type: string
 *           description: Album ID
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Отримати всі відгуки
 *     tags: [Відгуки]
 *     responses:
 *       200:
 *         description: Список відгуків
 *   post:
 *     summary: Створити новий відгук
 *     tags: [Відгуки]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Відгук створено
 */
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Отримати відгук за ID
 *     tags: [Відгуки]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID відгуку
 *     responses:
 *       200:
 *         description: Дані відгуку
 *   patch:
 *     summary: Оновити відгук
 *     tags: [Відгуки]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID відгуку
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Відгук оновлено
 *   delete:
 *     summary: Видалити відгук
 *     tags: [Відгуки]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID відгуку
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
