const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createPortalUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

const getPortalUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPortalUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updatePortalUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    })
    .min(1),
};

const deletePortalUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPortalUser,
  getPortalUsers,
  getPortalUser,
  updatePortalUser,
  deletePortalUser,
};
