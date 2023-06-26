const mongoose = require('mongoose');

// App schema is recommended for multi-platform feature.
// Fields can be added or removed based on requirement.

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

    portalOtpOption: {
      type: String,
      enum: ['optional', 'required'],
      default: 'optional',
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    slug: {
      type: String,
      slug: 'name',
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
      logomark: { type: String },
      logomarkLight: { type: String },
      logoEmail: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

appSchema.pre('save', function (next) {
  this.slug = this.name.split(' ').join('-').toLowerCase() + '-app';
  next();
});

const App = mongoose.model('App', appSchema);

module.exports = App;
