const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { validateUser } = require('../validations/userValidation');

const router = express.Router();




router.post('/signup', validateUser, authController.signup);


router.post('/login', authController.login);


router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)
  .post(authController.protect, authController.restrictTo('admin'), validateUser, userController.createUser);


router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
