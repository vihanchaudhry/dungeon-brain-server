const express = require('express');
const UsersController = require('../../controllers/users');
const authorization = require('../../middleware/authorization');

const router = express.Router();

// @desc    Register user
// @route   POST /api/users/register
router.post('/register', UsersController.register);

// @desc    Login user
// @route   POST /api/users/login
router.post('/login', UsersController.login);

// @desc    Change user password
// @route   POST /api/users/change-password
router.post('/change-password', authorization, UsersController.changePassword);

module.exports = router;
