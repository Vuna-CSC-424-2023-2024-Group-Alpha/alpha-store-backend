const httpStatus = require('http-status');
const { ConsoleUser } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a console user
 * @param {Object} body
 * @returns {Promise<ConsoleUser>}
 */
const createConsoleUser = async (body) => {
  if (await ConsoleUser.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const newConsoleUser = new ConsoleUser(body);
  newConsoleUser.save();
  return newConsoleUser;
};

/**
 * Get console User by id
 * @param {ObjectId} id
 * @returns {Promise<ConsoleUser>}
 */
const getConsoleUserById = async (id) => {
  return ConsoleUser.findById(id);
};

/**
 * Get console user by Email
 * @param {string} email
 * @returns {Promise<ConsoleUser>}
 */
const getConsoleUserByEmail = async (email) => {
  return ConsoleUser.findOne({ email });
};

/**
 *Update console user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns  {Promise<ConsoleUser>}
 */
const updateConsoleUserById = async (userId, updateBody) => {
  const consoleUser = await getConsoleUserById(userId);
  if (!consoleUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Console User not found');
  }
  if (updateBody.email && (await ConsoleUser.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(consoleUser, updateBody);
  await consoleUser.save();
  return consoleUser;
};

const deleteConsoleUserById = async (userId) => {
  const consoleUser = await getConsoleUserById(userId);
  if (!consoleUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Console User to be deleted not found');
  }
};

module.exports = {
  createConsoleUser,
  getConsoleUserById,
  getConsoleUserByEmail,
  updateConsoleUserById,
  deleteConsoleUserById,
};
