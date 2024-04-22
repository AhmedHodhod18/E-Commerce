const express = require('express');
const { signUpValidator, logInValidator } = require('../utils/validators/authValidator');
const { signUp, logIn } = require('../services/authService');

const router = express.Router();

router.route('/signup').post(signUpValidator, signUp);
router.route('/login').post(logInValidator, logIn);


module.exports = router