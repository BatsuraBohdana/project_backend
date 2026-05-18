const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { validateUser } = require('../validations/userValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управління користувачами та автентифікація
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Користувача успішно зареєстровано
 */
router.post('/signup', validateUser, authController.signup);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Вхід у систему
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успішний вхід
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Отримати всіх користувачів
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список користувачів
 *   post:
 *     summary: Створити нового користувача
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Користувача створено
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
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані користувача
 *   patch:
 *     summary: Оновити користувача
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані користувача оновлено
 *   delete:
 *     summary: Видалити користувача
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
