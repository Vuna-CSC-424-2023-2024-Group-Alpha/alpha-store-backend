const mongoose = require('mongoose');
const { PortalUser } = require('../models');
const logger = require('../config/logger');

const portalUsers = [
  {
    firstName: 'Haqq',
    lastName: 'Sandbox',
    email: 'sandbox@haqqman.agency',
    password: 'P@ssw0rd!Portal',
    app: ['6473371118833922f0a04492'],
  },
  {
    firstName: 'Gideon',
    lastName: 'Dadi',
    email: 'gideon@example.com',
    password: 'P@ssw0rd!Gideon',
    app: ['6473371118833922f0a04492'],
  },
];

module.exports = async function seedPortalUsers() {
  const portalUserPromises = portalUsers.map((portalUser) => {
    const seedPortalUser = async () => {
      const exists = await PortalUser.findOne({ email: portalUser.email });
      if (exists) {
        // skip current consoleUser if they already exist
        logger.info(`Portal user with email "${portalUser.email}" already exists, skipping...`);
        return;
      }
      await PortalUser.create(portalUser);
    };

    return seedPortalUser();
  });
  await Promise.all(portalUserPromises);
};
