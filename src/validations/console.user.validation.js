const Joi = require('joi').extend(require('@joi/date'));
const { password, objectId } = require('./custom.validation');
const { roles } = require('../config/roles');

const createConsoleUser = {
  body: Joi.object().keys({
    workmail: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastNam: Joi.string().required(),
    role: Joi.string().valid(...roles),
    status: Joi.string().valid(...['active', 'inactive']),
    dateOfBirth: Joi.date().format('DD-MM-YYYY'),
    gender: Joi.string().valid(...['Male', 'Female']),
    phoneNumber: Joi.string(),
    location: Joi.string(),
  }),
};

const getConsoleUser = {
  params: Joi.object().keys({
    consoleUserId: Joi.string().custom(objectId),
  }),
};

const updateConsoleUser = {
  params: Joi.object().keys({
    consoleUserId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      workmail: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string(),
      lastName: Joi.string(),
      dateOfBirth: Joi.date().format('DD-MM-YYYY'),
      phoneNumber: Joi.string(),
      location: Joi.string(),
    })
    .min(1),
};

const updateConsoleUserStatus = {
  params: Joi.object().keys({
    consoleUserId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('active', 'inactive'),
  }),
};

const inviteConsoleUser = {
  body: Joi.object().keys({
    workmail: Joi.string().required().email(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(...roles),
  }),
};

const acceptInvite = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    confirm_password: Joi.required().valid(Joi.ref('password')), // checks if comfirm_password matches 'password'
  }),
};

module.exports = {
  createConsoleUser,
  updateConsoleUser,
  updateConsoleUserStatus,
  getConsoleUser,
  inviteConsoleUser,
  acceptInvite,
};
