const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const consoleAuthController = require('../../controllers/console.auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/login', validate(authValidation.login), consoleAuthController.login);
router.post('/logout', validate(authValidation.logout), consoleAuthController.logout);
router.post('/reset-password', validate(authValidation.resetPassword), consoleAuthController.resetPassword);
router.put('/reset-password/:token', validate(authValidation.setNewPassword), consoleAuthController.setNewPassword);
router.post('/verify-otp', auth(), validate(authValidation.verifyAccessOTP), consoleAuthController.verifyOTP);
