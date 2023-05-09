const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../config/logger');
const seedConsoleUsers = require('./console.users');
const seedApps = require('./app');

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
    await seedApps();
    logger.info('seeding completed successfully');
  } catch (err) {
    logger.error(err);
  } finally {
    await mongoose.disconnect();
  }
};
