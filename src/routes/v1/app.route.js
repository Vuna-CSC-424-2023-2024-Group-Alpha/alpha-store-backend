const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { appController } = require('../../controllers');
const { appValidation } = require('../../validations');

const router = express.Router();

router.get('/', appController.getAllApps);
router.patch('/update-status/:appId', auth(), validate(appValidation.updateAppStatus), appController.updateAppStatus);

//Disabled by default unless needed!"
// router.post('/create', validate(appValidation.createApp), appController.createApp);

router.patch('/use-OTP', auth(), appController.updatePortalOtpOption);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Console App
 *   description: App management
 */

/**
 * @swagger
 * /app:
 *   get:
 *     summary: Get all apps.
 *     description: Get all apps which is a platform
 *     tags: [Console App]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/App'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /app/create:
 *    post:
 *      summary: Create a App.
 *      description:
 *      tags: [Console App]
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - contactPerson
 *               - phoneNumber
 *               - email
 *               - status
 *               - description
 *             properties:
 *                name:
 *                  type: string
 *                address:
 *                  type: string
 *                contactPerson:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                email:
 *                  type: string
 *                status:
 *                  type: string
 *                description:
 *                  type: string
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/App'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /app/use-OTP:
 *   patch:
 *     summary: sets the two factor authentication  to required or optional for the portalUser
 *     tags: [Console App]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - id
 *              - portalOtpOption
 *             properties:
 *                id:
 *                  type: objectId
 *                portalOtpOption:
 *                  type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */


/**
 * @swagger
 * /app/update-status/{appId}:
 *   patch:
 *     summary: Update the status (portal, website) of the app
 *     tags: [Console App]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appId
 *         required: true
 *         description: ID of the app
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                portalStatus:
 *                  type: string
 *                  example: online
 *                websiteStatus:
 *                  type: string
 *                  example: online
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */