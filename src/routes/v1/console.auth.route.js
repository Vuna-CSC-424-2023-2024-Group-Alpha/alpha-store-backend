const express = require('express');
const validate = require('../../middlewares/validate');
const consoleAuthValidation = require('../../validations/console.auth.validation');
const consoleAuthController = require('../../controllers/console.auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/login', validate(consoleAuthValidation.login), consoleAuthController.login);
router.post('/logout', validate(consoleAuthValidation.logout), consoleAuthController.logout);
router.post('/reset-password', validate(consoleAuthValidation.resetPassword), consoleAuthController.resetPassword);
router.put('/reset-password/:token', validate(consoleAuthValidation.setNewPassword), consoleAuthController.setNewPassword);
router.post('/verify-otp', auth(), validate(consoleAuthValidation.verifyOTP), consoleAuthController.verifyOTP);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Console Auth
 *   description: Console User Authentication
 */

/**
 * @swagger
 * /console/auth/login:
 *   post:
 *     summary: Log in console user
 *     description: Grants access to existing console user, and on successful confirmation of the workmail, an OTP is sent to the workmail to verify their access to the console.
 *     tags: [Console Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: workmail@example.com
 *               password: P@ssw0rd!
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/ConsoleUser'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 *       "400":
 *         description: Invalid email domain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Invalid email domain
 */

/**
 * @swagger
 * /console/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Console Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /console/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: An email will be sent to reset password.
 *     tags: [Console Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /console/auth/reset-password/{token}:
 *   put:
 *     summary: Verify new password
 *     tags: [Console Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

/**
 * @swagger
 * /console/auth/verify-otp:
 *   post:
 *     summary: Verify OTP sent to the console user
 *     description: Verify the OTP sent to the console user after successful login.
 *     tags: [Console Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *             example:
 *               otp: 392920
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         description: OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: OTP expired!
 *       "401":
 *         description: Access verification with OTP failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Access verification with OTP failed
 */
