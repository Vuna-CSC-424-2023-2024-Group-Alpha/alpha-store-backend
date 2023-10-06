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

/**
 * Update password of portal user
 */
const updatePassword = async (userId, newPassword) => {
  try {
    // Update the user's password
    await portalUserService.updatePortalUserById(userId, { password: newPassword });
  } catch (error) {
    // If an error occurs during the update, handle it appropriately
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      // If the provided userId is invalid (not a valid ObjectId)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID');
    } else if (error.name === 'ValidationError') {
      // If the provided newPassword is invalid or doesn't meet validation criteria
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid password. Please provide a valid password.');
    } else if (error.name === 'UserNotFoundError') {
      // If the user with the given userId is not found in the database
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
    } else {
      // For any other unexpected error, throw a generic error message
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred while updating the password.');
    }
  }
};

/**
 * Update existing email for authenticated user
 */
const updateEmail = async (user, body) => {
  const checkUser = await portalUserService.getPortalUserByEmail(body.oldEmail);
  if (!checkUser) {
    throw new ApiError(404, 'No user exists for this email address');
  }

  if (user.email !== body.oldEmail) {
    throw new ApiError(400, 'Old Email does not match current email');
  }

  const code = await tokenService.generateUpdateEmailCode(user);

  await emailService.PortalUserUpdateEmail({
    to: body.newEmail,
    firstName: user.firstName,
    code,
  });
};

const confirmUpdateEmail = async (code, newEmail) => {
  const updateEmailTokenDoc = await tokenService.verifyUpdateEmailCode(code);
  console.log(updateEmailTokenDoc);
  const user = await portalUserService.getPortalUserById(updateEmailTokenDoc.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token!');
  }
  await portalUserService.updatePortalUserById(user.id, { email: newEmail });
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  setNewPassword,
  verifyEmail,
  verifyOTP,
  updatePassword,
  updateOtpOption,
  updateEmail,
  confirmUpdateEmail,
};
