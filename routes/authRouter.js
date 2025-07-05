const express = require("express");
const router = express.Router();
const controller = require('../controllers/authController');

router.get('/login', controller.loginUser);

router.post('/signup', controller.registerUser);

module.exports = router;