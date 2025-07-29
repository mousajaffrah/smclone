const express = require('express');
const router = express.Router();
const { RegisterUser, LoginUser } = require('../controller/authController');

// Registration route
router.post('/register', RegisterUser);

// Login route
router.post('/login', LoginUser);

module.exports = router;
