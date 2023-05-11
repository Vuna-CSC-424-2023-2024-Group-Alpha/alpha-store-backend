const mongoose = require('mongoose');
const { PortalUser } = require('../models');
const logger = require('../config/logger');

const portalUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'fake@example.com',
    password: 'password1',
    app: ['645a25f53a899430e89af2c8'],
  },
  {
    firstName: 'Gideon',
    lastName: 'Dadi',
    email: 'gideon@example.com',
    password: 'password1',
    app: ['645a25f53a899430e89af2c6'],
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
