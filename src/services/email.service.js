const postmark = require('postmark');

// Configure postmark
const client = new postmark.ServerClient(process.env.POSTMARK_SECRET);
const MAIL_FROM_DEFAULT = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_DEFAULT}>`;
const MAIL_FROM_PORTAL = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_PORTAL}>`;
const MAIL_FROM_CONSOLE = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_CONSOLE}>`;

const portalUrl = process.env.PORTAL_URL;
const consoleUrl = process.env.CONSOLE_URL;

// Sends a welcome email to new users upon registration.
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
const PortalNewUserVerificationCode = async (payload) => {
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
const PasswordResetSuccessful = async (payload) => {
  const { email, firstName, logoEmail } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_PORTAL,
    To: to,
    TemplateId: 25815659, // Postmark: Email Template for "PasswordResetSuccessful"
    TemplateModel: {
      email,
      firstName,
      logoEmail,
      portalUrl,
    },
  });
};

// Sends an OTP to grant access to an existing portal user.
const PortalVerifyUserAccessWithOTP = async (payload) => {
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

// Sends email to existing customers to update Email
const PortalUserUpdateEmail = async (payload) => {
  const { to, firstName, code } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_PORTAL,
    To: to,
    TemplateId: 33381234, // Postmark: Email Template for PortalUserUpdateEmail
    TemplateModel: {
      firstName,
      code,
      portalUrl,
    },
  });
};

// Sends an OTP to grant access to an existing console user.
const ConsoleVerifyUserAccessWithOTP = async (payload) => {
  const { to, firstName, otp, appName, logoEmail } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_CONSOLE,
    To: to,
    TemplateId: 25815659, // TODO: Replace with the right TemplateId for "VerifyConsoleUserAccessWithOTP"
    TemplateModel: {
      to,
      firstName,
      otp,
      appName,
      logoEmail,
      consoleUrl,
    },
  });
};

// Sends email inviting console user to join team
const ConsoleUserInvite = async (payload) => {
  const { to, firstName, token, inviterFullName, logoEmail, consoleId } = payload;  client.sendEmailWithTemplate({
    From: MAIL_FROM_CONSOLE,
    To: to,
    TemplateId: 31422776, //TODO: Replace with the right TemplateId for "InviteConsoleUser"
    TemplateModel: {
      firstName,
      inviterFullName,
      token,
      consoleId,
      consoleUrl,
      logoEmail,
    },
  });
};

// Sends Email to console user to recover access
const ConsoleRecoverAccessRequest = async (payload) => {
  const { to, firstName, lastName } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_DEFAULT,
    To: to,
    TemplateId: 25815659, //TODO: Replace with the right TemplateId for "ConsoleRecoverAccessRequest"
    TemplateModel: {
      to,
      firstName,
      lastName,
    },
  });
};

// Sends email to existing customers to reset password
const ConsoleUserResetPassword = async (payload) => {
  const { to, email, firstName, token } = payload;

  client.sendEmailWithTemplate({
    From: MAIL_FROM_PORTAL,
    To: to,
    TemplateId: 25815659, // Postmark: Email Template for "ConsoleUserResetPassword"
    TemplateModel: {
      email,
      firstName,
      token,
      consoleUrl,
    },
  });
};


module.exports = {
  PortalWelcome,
  PortalNewUserVerificationCode,
  PasswordResetSuccessful,
  PortalUserUpdateEmail,
  PortalVerifyUserAccessWithOTP,
  ConsoleVerifyUserAccessWithOTP,
  ConsoleRecoverAccessRequest,
  ConsoleUserInvite,
  ConsoleUserResetPassword,
};
