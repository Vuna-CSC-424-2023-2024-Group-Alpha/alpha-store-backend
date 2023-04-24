const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const consoleUserValidation = require('../../validations/console.user.validation');
const consoleUserController = require('../../controllers/console.user.controller');

const router = express.Router();

router.get('/:consoleUserId', auth('getUsers'), consoleUserController.getConsoleUser);
router.patch('/:consoleUserId', auth('manageUsers'), validate(consoleUserValidation.updateConsoleUser), consoleUserController.updateConsoleUser);
router.post('/invite', auth('inviteConsoleUser'), validate(consoleUserValidation.inviteConsoleUser), consoleUserController.inviteConsoleUser);
router.post('/accept-invite/:token', validate(consoleUserValidation.acceptInvite), consoleUserController.acceptInvite);

module.exports = router;