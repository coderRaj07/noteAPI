// src/services/authRoutes.js
const express = require('express');
const { signUp, login } = require('../controllers/authController');
const passport = require('../config/passport');

const router = express.Router();

// Auth Routes
router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;

