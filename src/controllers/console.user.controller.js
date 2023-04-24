const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { consoleUserService, emailService, tokenService } = require('../services');

const getConsoleUser = catchAsync(async (req, res) => {
  const user = await consoleUserService.getConsoleUserById(req.params.consoleUserId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Console user not found');
  }
  res.send(user);
});

const updateConsoleUser = catchAsync(async (req, res) => {
  const user = await consoleUserService.updateConsoleUserById(req.params.consoleUserId, req.body);
  res.send(user);
});

const inviteConsoleUser = catchAsync(async (req, res) => {
  // check if user with email already exists
  const user = await consoleUserService.getConsoleUserByEmail(req.body.email);
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate Workmail');
  }
  const { email, firstName } = req.body;
  const token = await tokenService.generateInviteConsoleUserToken(req.body);
  await emailService.InviteConsoleUser({
    // TODO: Implement InviteConsoleUser Email
  });

  res.status(httpStatus.NO_CONTENT).send();
});

const acceptInvite = catchAsync(async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  const payload = await tokenService.generateConsoleUserPayloadFromToken(token);
  const user = await consoleUserService.createConsoleUser({ ...payload, password });
  res.send({ user });
});

module.exports = {
  getConsoleUser,
  updateConsoleUser,
  inviteConsoleUser,
  acceptInvite,
};
