const express = require('express');
const { register, login, loginLimiter, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', loginLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);

module.exports = router;
