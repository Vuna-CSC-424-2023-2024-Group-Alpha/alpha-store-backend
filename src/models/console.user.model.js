const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const consoleUserSchema = mongoose.Schema(
  {
    consoleUserId: {
      type: String,
      required: true,
      immutable: true,
      default: shortid.generate,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    workmail: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid workmail');
        }
      },
    },

    password: {
      type: String,
      requred: true,
      trim: true,
      minlength: 6,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    role: {
      type: String,
      enum: roles,
      default: 'administrator',
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ['Male', 'Female'],
      immutable: true,
    },

    phoneNumber: {
      type: String,
    },

    location: {
      type: String,
    },

    activeApp: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'App',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
consoleUserSchema.plugin(toJSON);
consoleUserSchema.plugin(paginate);

/**
 * Check if workmail is taken
 * @param {string} email - The console user's email
 * @param {import('mongoose').ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns { Promise<boolean>}
 */

consoleUserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const consoleUser = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!consoleUser;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
consoleUserSchema.methods.isPasswordMatch = async function (password) {
  const consoleUser = this;
  return bcrypt.compare(password, consoleUser.password);
};

consoleUserSchema.pre('save', async function (next) {
  const consoleUser = this;
  if (consoleUser.isModified('password')) {
    consoleUser.password = await bcrypt.hash(consoleUser.password, 8);
  }

  next();
});

/**
 * @typedef User
 */
const ConsoleUser = mongoose.model('Console_User', consoleUserSchema);

module.exports = ConsoleUser;
