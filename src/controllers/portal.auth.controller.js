const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { portalAuthService, portalUserService, tokenService, emailService } = require('../services');

const createAccount = catchAsync(async (req, res) => {
  const user = await portalUserService.createPortalUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await portalAuthService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await portalAuthService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await portalAuthService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const resetPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const setNewPassword = catchAsync(async (req, res) => {
  await portalAuthService.setNewPassword(req.params.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailCode = await tokenService.generateVerifyEmailCode(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailCode);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await portalAuthService.verifyEmail(req.body.vCode, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAccount,
  login,
  logout,
  refreshTokens,
  resetPassword,
  setNewPassword,
  sendVerificationEmail,
  verifyEmail,
};