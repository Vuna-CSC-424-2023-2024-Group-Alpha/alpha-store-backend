const mongoose = require('mongoose');

// App schema is a placeholder for any platform being built
// fields can be added or removed base on requirement.

const appSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    contactPerson: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    workmail: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    description: {
      type: String,
    },

    reviews: [
      {
        name: { type: String },
        rating: { type: Number },
        comment: { type: String },
      },
    ],

    ratings: {
      type: Number,
    },

    portalUrl: {
      type: String,
    },
    consoleUrl: {
      type: String,
    },

    images: [{ type: String }],

    branding: {
      logo: { type: String },
      logoLight: { type: String },
      logoCompact: { type: String },
      logoCompactLight: { type: String },
      logoEmail: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const App = mongoose.model('App', appSchema);

module.exports = App;
