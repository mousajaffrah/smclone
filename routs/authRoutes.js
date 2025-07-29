const express = require('express');
const router = express.Router();
const { RegisterUser, LoginUser } = require('../controller/authController');

router.post('/register', RegisterUser);
router.post('/login', LoginUser);

module.exports = router;
