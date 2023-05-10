const httpStatus = require('http-status');
const { ConsoleUser } = require('../models');
const ApiError = require('../utils/ApiError');
const getNextConsoleUserId = require('../utils/generateConsoleUserId');

/**
 * Create a console user
 * @param {Object} body
 * @returns {Promise<ConsoleUser>}
 */
const createConsoleUser = async (body) => {
  if (await ConsoleUser.isEmailTaken(body.workmail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The workmail entered already exists!');
  }

  const newConsoleUser = await ConsoleUser.create({
    ...body,
    consoleUserId: await getNextConsoleUserId(),
  });
  return newConsoleUser;
};

/**
 * Get all console users
 * @returns {Promise<[ConsoleUser]>}
 */
const getConsoleUsers = async () => {
  return ConsoleUser.find({});
};

/**
 * Get console user by id
 * @param {ObjectId} id
 * @returns {Promise<ConsoleUser>}
 */
const getConsoleUser = async (id) => {
  return ConsoleUser.findById(id);
};

/**
 * Get console user by workmail
 * @param {string} workmail
 * @returns {Promise<ConsoleUser>}
 */
const getConsoleUserByWorkmail = async (workmail) => {
  return ConsoleUser.findOne({ workmail });
};

/**
 *Update console user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns  {Promise<ConsoleUser>}
 */
const updateConsoleUser = async (userId, updateBody) => {
  const consoleUser = await getConsoleUser(userId);
  if (!consoleUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Console User not found');
  }
  if (updateBody.workmail && (await ConsoleUser.isWorkmailTaken(updateBody.workmail, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Workmail already taken');
  }
  Object.assign(consoleUser, updateBody);
  await consoleUser.save();
  return consoleUser;
};

/**
 * Update console user status
 * @param {ObjectId}
 * @param {string} status
 * @returns {Promise<Void>}
 */
const updateConsoleUserStatus = async (consoleUserId, status) => {
  await ConsoleUser.updateOne({ _id: consoleUserId }, { status });
};

module.exports = {
  createConsoleUser,
  getConsoleUsers,
  getConsoleUser,
  getConsoleUserByWorkmail,
  updateConsoleUser,
  updateConsoleUserStatus,
};
