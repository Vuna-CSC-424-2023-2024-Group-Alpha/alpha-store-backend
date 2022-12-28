const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const _ = require('lodash');

/**
 * Check if token has expired
 * @returns {boolean}
 */
const hasExpired = (tokenDoc) => {
  const expiresIn = moment().diff(tokenDoc.createdAt, 'minutes');
  return expiresIn >= config.jwt.verifyEmailExpirationMinutes;
};

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  if (type === tokenTypes.VERIFY_EMAIL) aco;
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Verify code and return token doc (or throw an error if it is not valid)
 * @param {string} code
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyCode = async (code, userId) => {
  const tokenDoc = await Token.findOne({ token: code, type: tokenTypes.VERIFY_EMAIL, user: userId, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  if (hasExpired(tokenDoc)) throw new ApiError(httpStatus.BAD_REQUEST, 'Token expired!');
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email code
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailCode = async (user) => {
  const previousTokens = await Token.find({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
  let previousToken = null;
  for (const token of previousTokens) {
    if (hasExpired(token)) {
      await Token.deleteOne({ _id: token.id });
    }
    previousToken = token;
  }

  if (previousToken) {
    const expiresIn = moment().diff(previousToken.createdAt, 'minutes');
    throw new ApiError(httpStatus.BAD_REQUEST, `We recieved your request too often. Please wait ${expiresIn} minute (s)`);
  }

  const code = _.random(100000, 999999);
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  await saveToken(code, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return code;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  verifyCode,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailCode,
};
