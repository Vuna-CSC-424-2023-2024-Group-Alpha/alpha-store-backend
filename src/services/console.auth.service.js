const httpStatus = require('http-status');
const parser = require('tld-extract');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const consoleUserService = require('./console.user.service');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../models');
const blockedDomains = require('../config/blocked.workmail.domains');

/**
 * Login with username and password
 * @param {string} workmail
 * @param {string} password
 * @returns {Promise<ConsoleUser>}
 */
const loginConsoleUserWithWorkmailAndPassword = async (workmail, password) => {
  if (hasBlockedDomain(workmail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workmail domain');
  }

  const consoleUser = await consoleUserService.getConsoleUserByWorkmail(workmail);
  if (!consoleUser || !(await consoleUser.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect workmail or password');
  }
  return consoleUser;
};

/**
 * 
 * @param {String} refreshToken 
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token:refreshToken,  typr: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove()
}

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
    await consoleUserService.updateConsoleUser(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await consoleUserService.getConsoleUser(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token does not exist');
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
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
    const user = await consoleUserService.getConsoleUser(otpDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'OTP does not exist');
    }
    await Token.deleteMany({ userId: user.id, type: tokenTypes.VERIFY_ACCESS });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access verification with OTP failed');
  }
};

const hasBlockedDomain = (workmail) => {
  for (let blockedDomain of blockedDomains) {
    const fullAddress = 'http://' + workmail.split('@').pop();
    const { domain } = parser(fullAddress);
    if (domain === blockedDomain) {
      return true;
    }
  }
  return false;
};

module.exports = {
  loginConsoleUserWithWorkmailAndPassword,
  logout,
  setNewPassword,
  refreshAuth,
  verifyOTP,
};
