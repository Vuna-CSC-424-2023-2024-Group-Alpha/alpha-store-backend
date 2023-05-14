const httpStatus = require('http-status');
const { PortalUser } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<PortalUser>}
 */
const createPortalUser = async (userBody) => {
  if (await PortalUser.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return PortalUser.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPortalUsers = async (filter, options) => {
  const users = await PortalUser.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<PortalUser>}
 */
const getPortalUserById = async (id) => {
  return PortalUser.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<PortalUser>}
 */
const getPortalUserByEmail = async (email) => {
  return PortalUser.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<PortalUser>}
 */
const updatePortalUserById = async (userId, updateBody) => {
  const user = await getPortalUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PortalUser not found');
  }
  if (updateBody.email && (await PortalUser.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<PortalUser>}
 */
const deletePortalUserById = async (userId) => {
  const user = await getPortalUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PortalUser not found');
  }
  await user.remove();
  return user;
};

const updateOtpOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { otpOption } = req.body;

    const portalUser = await PortalUser.findByIdAndUpdate(id, { otpOption }, { new: true });

    if (!portalUser) {
      return res.status(404).json({ error: 'Portal user not found' });
    }

    return res.status(200).json(portalUser);
  } catch (error) {
    consol.log(error);
  }
};

module.exports = {
  createPortalUser,
  queryPortalUsers,
  getPortalUserById,
  getPortalUserByEmail,
  updatePortalUserById,
  deletePortalUserById,
  updateOtpOption,
};
