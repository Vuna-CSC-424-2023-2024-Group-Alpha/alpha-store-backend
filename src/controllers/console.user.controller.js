const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { consoleUserService, emailService, tokenService, appService } = require('../services');

const getConsoleUsers = catchAsync(async (req, res) => {
  const consoleUsers = await consoleUserService.getConsoleUsers();
  res.send(consoleUsers);
});

const getConsoleUser = catchAsync(async (req, res) => {
  const user = await consoleUserService.getConsoleUser(req.params.consoleUserId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Console User not found');
  }
  res.send(user);
});

const updateConsoleUser = catchAsync(async (req, res) => {
  const user = await consoleUserService.updateConsoleUser(req.params.consoleUserId, req.body)
  res.send(user);
});

const updateConsoleUserStatus = catchAsync(async (req, res) => {
  await consoleUserService.updateConsoleUserStatus(req.params.consoleUserId, req.body.status);
  res.status(httpStatus.NO_CONTENT).send();
});

const consoleUserInvite = catchAsync(async (req, res) => {
  // check if user with workmail already exists
  const inviter = req.user;
  const user = await consoleUserService.getConsoleUserByWorkmail(req.body.workmail);
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The workmail provided already exists!');
  }

  const { workmail, firstName, lastName, role } = req.body;
  const token = await tokenService.generateConsoleUserInviteToken(req.body);
  const { consoleUserId: consoleId } = await tokenService.generateConsoleUserPayloadFromToken(token);
  await consoleUserService.createConsoleUser({ ...req.body, status: 'inactive' });
  await emailService.ConsoleUserInvite({
    token,
    consoleId,
    firstName,
    to: workmail,
    inviterFullName: `${inviter.firstName} ${inviter.lastName}`,
  });

  res.status(httpStatus.NO_CONTENT).send();
});

const acceptInvite = catchAsync(async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  const payload = await tokenService.generateConsoleUserPayloadFromToken(token);
  const user = await consoleUserService.updateConsoleUserByEmail(payload.workmail, { password, status: 'active' });
  res.send({ user });
});

module.exports = {
  getConsoleUser,
  getConsoleUsers,
  updateConsoleUserStatus,
  updateConsoleUser,
  consoleUserInvite,
  acceptInvite,
};
