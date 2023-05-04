const Joi = require('joi');
const { password } = require('./custom.validation');

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const setNewPassword = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    vCode: Joi.string().required(),
  }),
};

const verifyOTP = {
  body: Joi.object().keys({
    otp: Joi.string().min(6).max(6).required(),
  }),
};

module.exports = {
  login,
  logout,
  refreshTokens,
  resetPassword,
  setNewPassword,
  verifyEmail,
  verifyOTP,
};