const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { validateUser } = require('../validations/userValidation');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Користувачі]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Користувача створено
 */
router.post('/signup', validateUser, authController.signup);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Вхід у систему
 *     tags: [Користувачі]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успішний вхід
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Отримати всіх користувачів (Тільки для Admin)
 *     tags: [Користувачі]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список користувачів
 */
router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)
  .post(authController.protect, authController.restrictTo('admin'), validateUser, userController.createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Отримати користувача за ID
 *     tags: [Користувачі]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Дані користувача
 *   patch:
 *     summary: Оновити дані користувача
 *     tags: [Користувачі]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Дані оновлено
 *   delete:
 *     summary: Видалити користувача
 *     tags: [Користувачі]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     responses:
 *       204:
 *         description: Користувача видалено
 */
router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
