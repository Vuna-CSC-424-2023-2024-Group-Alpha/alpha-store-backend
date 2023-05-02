const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { consoleAuthService, authService, tokenService, emailService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await consoleAuthService.loginConsoleUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const otp = await tokenService.generateUserAccessOTP(user);
  // send otp to console user email
  await emailService.VerifyConsoleUserAccessWithOTP({
    to: user.email,
    firstName: user.firstName,
    otp: otp,
  });
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  // reuse default authService.logout since it's user model agnostic
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email, 'ConsoleUser');
  // TODO: Implement sendResetPasswordEmail
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const setNewPassword = catchAsync(async (req, res) => {
  await consoleAuthService.setNewPassword(req.params.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyOTP = catchAsync(async (req, res) => {
  await consoleAuthService.verifyOTP(req.body.otp, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  login,
  logout,
  resetPassword,
  setNewPassword,
  verifyOTP,
};
