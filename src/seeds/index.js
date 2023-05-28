const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../config/logger');
const seedConsoleUsers = require('./console.users');
const seedPortalUsers = require('./portal.users');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  const argv = require('yargs').command(
    'seed',
    'Seed the database with default data',
    () => {},
    () => {
      seed();
    }
  ).argv;
});

const seed = async () => {
  try {
    await seedConsoleUsers();
    await seedPortalUsers();
    logger.info('seeding completed successfully');
  } catch (err) {
    logger.error(err);
  } finally {
    await mongoose.disconnect();
  }
};
