const mongoose = require('mongoose');
const { ConsoleUser } = require('../models');
const logger = require('../config/logger');

const consoleUsers = [
  {
    consoleUserId: '467835001',
    firstName: 'Haqq',
    lastName: 'Manager',
    workmail: 'webmanager@haqqman.agency',
    password: 'P@ssw0rd!',
    role: 'admin',
    dateOfBirth: '11-13-1980', // format: MM-DD-YYYY
    gender: 'Male',
    phoneNumber: '0701 156 8196',
    location: 'Abuja',
  },
  {
    consoleUserId: '467835002',
    firstName: 'Sand',
    lastName: 'Box',
    workmail: 'sandbox@haqqman.agency',
    password: 'c@@lPassw0rd',
    role: 'admin',
    dateOfBirth: '11-13-1980', // format: MM-DD-YYYY
    gender: 'Male',
    phoneNumber: '0800 000 0000',
    location: 'Abuja',
  },
];

module.exports = async function seedConsoleUsers() {
  const consoleUserPromises = consoleUsers.map((consoleUser) => {
    const seedConsoleUser = async () => {
      const exists = await ConsoleUser.findOne({ email: consoleUser.email });
      if (exists) {
        // skip current consoleUser if they already exist
        logger.info(`console user with email "${consoleUser.email}" already exists, skipping...`);
        return;
      }
      await ConsoleUser.create(consoleUser);
    };

    return seedConsoleUser();
  });
  await Promise.all(consoleUserPromises);
};
