const mongoose = require('mongoose');
const { App } = require('../models');
const logger = require('../config/logger');

const apps = [
  {
    name: 'Example1 Brand',
    appId: '123456',
    address: 'Abuja, Nigeria',
    contactPerson: 'Brand1 Contact',
    phoneNumber: '0800 000 0000',
    email: 'sandbox@haqqman.agency',
    description: 'This description is just a placeholder',
    portalUrl: 'portal.example.com',
    consoleUrl: 'console.example.com',
    branding: {
      logoEmail: 'https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png',
    },
  },

  {
    name: 'Example2 Brand',
    appId: '123457',
    address: 'Lagos, Nigeria',
    contactPerson: 'Brand2 Contact',
    phoneNumber: '0800 000 0000',
    email: 'sandbox@haqqman.agency',
    description: 'This description is just a placeholder',
    portalUrl: 'portal.example.com',
    consoleUrl: 'console.example.com',
    branding: {
      logoEmail: 'https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png',
    },
  },
];

module.exports = async function seedApps() {
  const appPromises = apps.map((app) => {
    const seedApp = async () => {
      const exists = await App.findOne({ name: app.name });
      if (exists) {
        // skip current brand if they already exist
        logger.info(`App with name "${app.name}" already exists, skipping...`);
        return;
      }
      await App.create(app);
    };

    return seedApp();
  });
  await Promise.all(appPromises);
};
