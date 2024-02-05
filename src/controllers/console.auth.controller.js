const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { consoleAuthService, tokenService, emailService, appService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { workmail, password } = req.body;
  const user = await consoleAuthService.loginConsoleUserWithWorkmailAndPassword(workmail, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const otp = await tokenService.generateUserAccessOTP(user);
  let activeApp = await appService.getApp(user.activeApp);
  if (!activeApp) {
    activeApp = await appService.getAppBySlug('express-boilerplate-app');
    await consoleUserService.updateConsoleUser(user._id, { activeApp: activeApp._id, $push: { apps: activeApp._id } });
  }

  // send otp to console user workmail
  await emailService.ConsoleVerifyUserAccessWithOTP({
    to: user.workmail,
    firstName: user.firstName,
    appName: activeApp.name,
    logoEmail: activeApp.branding.logoEmail,
    portalUrl: activeApp.portalUrl,
    consoleUrl: activeApp.consoleUrl,
    otp: otp,
  });
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await consoleAuthService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.workmail, 'Console_User');
  const user = await consoleUserService.getConsoleUserByWorkmail(req.body.workmail);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No console user exists for this email');
  }
  // send reset password email
  await emailService.ConsoleUserResetPassword({
    to: user.workmail,
    token: resetPasswordToken,
    firstName: user.firstName,
  });

  res.status(httpStatus.NO_CONTENT).send();
});

const setNewPassword = catchAsync(async (req, res) => {
  await consoleAuthService.setNewPassword(req.params.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await consoleAuthService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
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
  refreshTokens,
  verifyOTP,
};
