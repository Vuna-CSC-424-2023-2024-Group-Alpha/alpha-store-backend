const express = require('express');
const validate = require('../../middlewares/validate');
const portalAuthValidation = require('../../validations/portal.auth.validation');
const portalAuthController = require('../../controllers/portal.auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
/** Public Endpoints */
router.post('/create-account', validate(portalAuthValidation.createAccount), portalAuthController.createAccount);
router.post('/login', validate(portalAuthValidation.login), portalAuthController.login);
router.post('/reset-password', validate(portalAuthValidation.resetPassword), portalAuthController.resetPassword);
router.put('/set-new-password/:token', validate(portalAuthValidation.setNewPassword), portalAuthController.setNewPassword);
router.post('/refresh-tokens', validate(portalAuthValidation.refreshTokens), portalAuthController.refreshTokens);
/** Authenticated Endpoints */
router.post('/resend-verification-email', auth(), portalAuthController.resendVerificationEmail);
router.post('/logout', validate(portalAuthValidation.logout), portalAuthController.logout);
router.post('/verify-email', auth(), validate(portalAuthValidation.verifyEmail), portalAuthController.verifyEmail);
router.put('/update-password', auth(), portalAuthController.updatePassword);
router.post('/update-email', auth(), validate(portalAuthValidation.updateEmail), portalAuthController.updateEmail);
router.patch('/update-email/:code', validate(portalAuthValidation.confirmUpdateEmail), portalAuthController.confirmUpdateEmail);
router.post('/verify-otp', auth(), validate(portalAuthValidation.verifyOTP), portalAuthController.verifyOTP);
router.patch('/update-OTP-option', auth(), portalAuthController.updateOtpOption);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portal Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /portal/auth/create-account:
 *   post:
 *     summary: Register new portal user
 *     tags: [Portal Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: fake@example.com
 *               password: P@ssword!Example
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/PortalUser'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /portal/auth/resend-verification-email:
 *   post:
 *     summary: Resend verification email
 *     description: Send new verification code to the user for email verification.
 *     tags: [Portal Auth]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Porta User's email address.
 *             example:
 *               email: user@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /portal/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Portal Auth]
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
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/PortalUser'
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
 */


/**
 * @swagger
 * /portal/auth/verify-email:
 *   post:
 *     summary: Verify email using verification code
 *     description: Verify email during account creation, using the 6 digits verification code sent to the email
 *     tags: [Portal Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vCode:
 *                 type: string
 *                 description: The verification code received by the user's email.
 *                 example: "010101"
 *     responses:
 *       '200':
 *         description: Email successfully verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the email has been verified.
 *       '400':
 *         description: Invalid email verification code or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Email verification failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


/**
 * @swagger
 * /portal/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Portal Auth]
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
 * /portal/auth/update-OTP-option:
 *   patch:
 *     summary: sets the use of the portalUser two factor authentication  to true or false
 *     tags: [Portal Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - otpOption
 *             properties:
 *                otpOption:
 *                  type: boolean
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /portal/auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Portal Auth]
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
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /portal/auth/reset-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Portal Auth]
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
 * /portal/auth/update-email:
 *   post:
 *     summary: Trigger Update email
 *     tags: [Portal Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldEmail:
 *                 type: string
 *                 format: email
 *               newEmail:
 *                 type: string
 *                 format: email
 *             example:
 *               oldEmail: oldemail@haqqman.agency
 *               newEmail: newemail@haqqman.agency
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /portal/auth/update-email/{code}:
 *   patch:
 *     summary: Verify and confirm request to update email
 *     tags: [Portal Auth]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The update email confirmation code
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
 *               newEmail:
 *                 type: string
 *                 format: email
 *             example:
 *               newEmail: newemail@haqqman.agency
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */



/**
 * @swagger
 * /portal/auth/set-new-password/:token:
 *   post:
 *     summary: Set New Password
 *     tags: [Portal Auth]
 *     parameters:
 *       - in: query
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
 * /portal/auth/update-password/:
 *   put:
 *     summary: Update Password
 *     description: Update password for a logged in portal user
 *     tags: [Portal Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               confirmNewPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               currentPassword: CurrentPassword!
 *               newPassword: NewPassword1
 *               confirmPassword: NewPassword1
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
 * /portal/auth/verify-otp:
 *   post:
 *     summary: Verify Portal access with OTP
 *     description: Verify the OTP sent to the portal user after successful login.
 *     tags: [Portal Auth]
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

