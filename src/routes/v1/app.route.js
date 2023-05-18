const express = require('express');
const validate = require('../../middlewares/validate');
const { appController } = require('../../controllers');
const { appValidation } = require('../../validations');

const router = express.Router();

router.get('/', appController.getApp);
router.post('./create', validate(appValidation.createApp), appController.createApp);
router.patch('./updated-OTP-option', appController.updatePortalOtpOption);

module.exports = router;


