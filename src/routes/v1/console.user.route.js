const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const consoleUserValidation = require('../../validations/console.user.validation');
const consoleUserController = require('../../controllers/console.user.controller');

const router = express.Router();

// 
router.get('/', auth('getUsers'), consoleUserController.getConsoleUsers);


router.get(
  '/:consoleUserId',
  auth('getUsers'),
  validate(consoleUserValidation.getConsoleUser),
  consoleUserController.getConsoleUser
);

router.patch(
  '/:consoleUserId',
  auth('manageUsers'),
  validate(consoleUserValidation.updateConsoleUser),
  consoleUserController.updateConsoleUser
);

router.patch(
  '/update-status/:consoleUserId',
  validate(consoleUserValidation.updateConsoleUserStatus),
  consoleUserController.updateConsoleUserStatus
);

router.post(
  '/invite',
  auth('inviteConsoleUser'),
  validate(consoleUserValidation.inviteConsoleUser),
  consoleUserController.inviteConsoleUser
);

router.post('/accept-invite/:token', validate(consoleUserValidation.acceptInvite), consoleUserController.acceptInvite);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Console Teams
 *   description: Console User Team for Management
 */

/**
 * @swagger
 * /console/teams:
 *   get:
 *     summary: Get all console users
 *     description: Retrieves all console users that make up a team
 *     tags: [Console Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   consoleUsers:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/ConsoleUser'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /console/teams/{consoleUserId}:
 *   get:
 *     summary: Get a Console user
 *     description: Retrieve a Console User  with the provided {consoleUserId}.
 *     tags: [Console Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consoleUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsoleUser'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Console user
 *     description: Update a Console User account with the provided {consoleUserId}.
 *     tags: [Console Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consoleUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: console user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               workmail:
 *                 type: string
 *                 format: workmail
 *                 description: must be unique
 *               role:
 *                 type: string
 *                 enum: ['administrator','manager','operations','support','webmanager']
 *               dateOfBirth:
 *                 type: Date
 *               location:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             example:
 *               workmail: workmail@example.com
 *               firstName: John
 *               lastName: Doe
 *               role: administrator
 *               location: 'Ikeja, Lagos State'
 *               dateOfBirth: '2001-11-23'
 *               phoneNumber: '+234011111111'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ConsoleUser'
 *       "400":
 *         $ref: '#/components/responses/DuplicateWorkmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /console/teams/update-status/{consoleUserId}:
 *   patch:
 *     summary: Update a Console user status
 *     description: Update status of the console user account of the provided {consoleUserId}.
 *     tags: [Console Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consoleUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: Console user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['active', 'inactive']
 *             example:
 *               status: inactive
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /console/teams/invite:
 *   post:
 *     summary: Invite a new team member (Console user)
 *     description: Invite a new team member (Console user) to the console, the user to be invited receives an mail with link to complete the invite.
 *     tags: [Console Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               workmail:
 *                 type: string
 *                 format: workmail
 *                 description: must be unique
 *               role:
 *                 type: string
 *                 enum: ['administrator','manager','operations','support','webmanager']
 *             example:
 *               workmail: workmail@example.com
 *               firstName: John
 *               lastName: Doe
 *               role: administrator
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/DuplicateWorkmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /console/teams/accept-invite/{token}:
 *   post:
 *     summary: Accept invite of a new team member, who is a Console user
 *     description: Accept invite of a new team member (Console user) to the console, this completes the invitation of a new console user.
 *     tags: [Console Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: token from invit console user workmail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *             example:
 *               confirm_password: str0ngp@ssword
 *               password: str0ngp@ssword
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsoleUser'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 */
