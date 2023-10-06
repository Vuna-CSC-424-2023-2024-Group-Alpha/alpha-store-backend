const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { App } = require('../models');
const { portalAuthService, portalUserService, tokenService, emailService, appService } = require('../services');

const createAccount = catchAsync(async (req, res) => {
  req.body.app = await App.findOne({});
  const user = await portalUserService.createPortalUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const updateOtpOption = catchAsync(async (req, res) => {
  const portalUser = await portalAuthService.updateOtpOption(req);
  res.send(portalUser);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await portalAuthService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const activeApp = await appService.getApp(user.app);
  let useOtp = user?.otpOption;
  let appOtp = activeApp?.portalOtpOption;

  if (useOtp || appOtp === 'required') {
    // send user OTP
    const accessOTP = await tokenService.generateUserAccessOTP(user);

    await emailService.VerifyPortalUserAccessWithOTP({
      to: user.email,
      firstName: user.firstName,
      otp: accessOTP,
      logoEmail: activeApp?.branding?.logoEmail,
      portalUrl: activeApp?.portalUrl ?? process.env.PORTAL_URL,
    });
  }
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

const resendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailCode = await tokenService.generateVerifyEmailCode(req.user);
  await emailService.resendVerificationEmail(req.user.email, verifyEmailCode);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await portalAuthService.verifyEmail(req.body.vCode, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyOTP = catchAsync(async (req, res) => {
  await portalAuthService.verifyOTP(req.body.otp, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

// Trigger email update
const updateEmail = catchAsync(async (req, res) => {
  await portalAuthService.updateEmail(req.user, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

// Verify and confirm request to update email
const confirmUpdateEmail = catchAsync(async (req, res) => {
  await portalAuthService.confirmUpdateEmail(req.params.code, req.body.newEmail);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAccount,
  updateOtpOption,
  login,
  logout,
  refreshTokens,
  resetPassword,
  setNewPassword,
  resendVerificationEmail,
  verifyEmail,
  verifyOTP,
  updateEmail,
  confirmUpdateEmail,
};
