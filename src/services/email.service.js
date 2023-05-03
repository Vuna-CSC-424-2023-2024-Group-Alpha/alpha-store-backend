const postmark = require('postmark');

// Configure postmark
const client = new postmark.ServerClient(process.env.POSTMARK_SECRET);
const MAIL_FROM_DEFAULT = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_DEFAULT}>`;
const MAIL_FROM_PORTAL = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_PORTAL}>`;
const MAIL_FROM_CONSOLE = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_CONSOLE}>`;

// Sends a welcome email to new users upon registration.
//NOT USED
const PortalWelcome = async (payload) => {
  const { to, firstName, email } = payload;

  // const email = 'webmanager@haqqman.agency';
  client.sendEmailWithTemplate({
    From: MAIL_FROM_PORTAL,
    To: to,
    TemplateId: 25815659, // TODO: Replace with the right TemplateId for "ExpressBoilerplateWelcome"
    TemplateModel: {
      email,
      firstName,
    },
  });
};

// Sends a verification code to new users for email verification.
//NOT USED
const NewPortaltalUserVerificationCode = async (payload) => {
  const { firstName, email, code } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_PORTAL,
    To: to,
    TemplateId: 25815659, // Postmark: Email Template for "NewUserVerificationCode"
    TemplateModel: {
      email,
      firstName,
      code,
    },
  });
};

// Sends a notification email to users when their password is successfully reset.
//NOT USED
const PasswordResetSuccessful = async (payload) => {
  const { email, firstName } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_PORTAL,
    To: to,
    TemplateId: 25815659, // Postmark: Email Template for "PasswordResetSuccessful"
    TemplateModel: {
      email,
      firstName,
    },
  });
};

// Sends an OTP to grant access to an existing portal user.
// Used in portal.auth.controller.js
const VerifyPortalUserAccessWithOTP = async (payload) => {
  const { to, firstName, otp } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_PORTAL,
    To: to,
    TemplateId: 25815659,
    TemplateModel: {
      to,
      firstName,
      otp,
    },
  });
};

// Sends an OTP to grant access to an existing console user.
// Used in console.auth.controller.js
const VerifyConsoleUserAccessWithOTP = async (payload) => {
  const { to, firstName, otp } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_CONSOLE,
    To: to,
    TemplateId: 25815659, // TODO: Replace with the right TemplateId for "VerifyConsoleUserAccessWithOTP"
    TemplateModel: {
      to,
      firstName,
      otp,
    },
  });
};

// Sends email inviting a console user to join a team
// Used in the console.user.controller to invite console user
const InviteConsoleUser = async (payload) => {
  const { to, firstName, token } = payload;
  client.sendEmailWithTemplate({
    From: MAIL_FROM_CONSOLE,
    To: to,
    TemplateId: 31422776, //TODO: Replace with the right TemplateId for "InviteConsoleUser"
    TemplateModel: {
      firstName,
      token,
    },
  });
};

// Sends Email to console user to recover access
//NOT USED
const recoverConsoleAccessRequest = async (payload) => {
  const { to, firstName, lastName } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_DEFAULT,
    To: to,
    TemplateId: 25815659, //TODO: Replace with the right TemplateId for "recoverConsoleAccessRequest"
    TemplateModel: {
      to,
      firstName,
      lastName,
    },
  });
};

module.exports = {
  PortalWelcome,
  NewPortaltalUserVerificationCode,
  PasswordResetSuccessful,
  VerifyPortalUserAccessWithOTP,
  VerifyConsoleUserAccessWithOTP,
  InviteConsoleUser,
  recoverConsoleAccessRequest,
};
