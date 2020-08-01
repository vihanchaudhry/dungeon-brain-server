const express = require('express');
const UsersController = require('../../controllers/users');

const router = express.Router();

// @desc    Register user
// @route   POST /api/users/register
router.post('/register', UsersController.register);

// @desc    Login user
// @route   POST /api/users/login
router.post('/login', UsersController.login);

module.exports = router;
