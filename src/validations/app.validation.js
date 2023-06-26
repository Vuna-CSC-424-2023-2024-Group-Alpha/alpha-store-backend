const Joi = require('joi');

const createApp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    contactPerson: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    workmail: Joi.string().required().email(),
    portalUrl: Joi.string().required(),
    consoleUrl: Joi.string().required(),
    branding: Joi.object().keys({
      logo: Joi.string(),
      logoLight: Joi.string(),
      logomark: Joi.string(),
      logomarkLight: Joi.string(),
      logoEmail: Joi.string(),
    }),
    portalOtpOption: Joi.string().valid('optional', 'required'),
    status: Joi.string().valid('active', 'inactive'),
    description: Joi.string(),
  }),
};

module.exports = {
  createApp,
};
