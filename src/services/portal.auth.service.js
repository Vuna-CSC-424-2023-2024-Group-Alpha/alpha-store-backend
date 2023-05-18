const httpStatus = require('http-status');
const tokenService = require('./token.service');
const portalUserService = require('./portal.user.service');
const { Token } = require('../models');
const { PortalUser } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await portalUserService.getPortalUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await portalUserService.getPortalUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
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
    const user = await portalUserService.getPortalUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token!');
    }
    await portalUserService.updatePortalUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailCode
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailCode, userId) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyCode(verifyEmailCode, userId);
    const user = await portalUserService.getPortalUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await portalUserService.updatePortalUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const verifyOTP = async (otp, userId) => {
  try {
    const otpDoc = await tokenService.verifyAccessOTP(otp, userId);
    const user = await consoleUserService.getConsoleUserById(otpDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'OTP does not exist');
    }
    await Token.deleteMany({ userId: user.id, type: tokenTypes.VERIFY_OTP });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access verification with OTP failed');
  }
};

const updateOtpOption = async (req) => {
  try {
    const { id } = req.user;
    const { otpOption } = req.body;

    const portalUser = await PortalUser.findByIdAndUpdate(id, { otpOption }, { new: true });

    if (!portalUser) {
      throw new ApiError(httpStatus.NOT_FOUND, ' Portal User not found');
    }

    return portalUser;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  setNewPassword,
  verifyEmail,
  verifyOTP,
  updateOtpOption,
};
