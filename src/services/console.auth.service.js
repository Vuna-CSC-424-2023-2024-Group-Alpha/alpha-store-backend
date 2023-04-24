const httpStatus = require('http-status');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const consoleUserService = require('./console.user.service');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../models');
const blockedDomains = require('../config/blocked.email.domains');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<ConsoleUser>}
 */
const loginConsoleUserWithEmailAndPassword = async (email, password) => {
  if (hasBlockedDomain(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workmail domain');
  }

  const consoleUser = await consoleUserService.getConsoleUserByEmail(email);
  if (!consoleUser || !(await consoleUser.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect workmail or password');
  }
  return consoleUser;
};

/**
 * Reset password
 * @param {string} setNewPassword
 * @param {string} newPassword
 * @returns {Promise}
 */
const setNewPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await consoleUserService.getConsoleUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token!');
    }
    await consoleUserService.updateConsoleUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify OTP
 * @param {string} otp
 * @param {string} userId
 * @returns {Promise}
 */
const verifyOTP = async (otp, userId) => {
  try {
    const otpDoc = await tokenService.verifyAccessOTP(otp, userId);
    const user = await consoleUserService.getConsoleUserById(otpDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'OTP does not exist');
    }
    await Token.deleteMany({ userId: user.id, type: tokenTypes.VERIFY_ACCESS });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access verification with OTP failed');
  }
};

const hasBlockedDomain = (email) => {
  for (let blockedDomain of blockedDomains) {
    const fullAddress = 'http://' + email.split('@').pop();
    const { domain } = parser(fullAddress);
    if (domain === blockedDomain) {
      return true;
    }
  }
  return false;
};

module.exports = {
  loginConsoleUserWithEmailAndPassword,
  setNewPassword,
  verifyOTP,
};
