const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

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
