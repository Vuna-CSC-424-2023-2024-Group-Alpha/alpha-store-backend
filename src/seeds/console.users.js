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
    dateOfBirth: '11-13-1980', // format: MM-DD-YYYY
    gender: 'Male',
    phoneNumber: '0701 156 8196',
    location: 'Abuja',
    activeApp: ['6473371118833922f0a04492'],
  },
  {
    consoleUserId: '467835002',
    firstName: 'Agency',
    lastName: 'Sandbox',
    workmail: 'sandbox@haqqman.agency',
    password: 'c@@lPassw0rd',
    dateOfBirth: '11-13-1980', // format: MM-DD-YYYY
    gender: 'Male',
    phoneNumber: '0800 000 0000',
    location: 'Abuja',
    activeApp: ['6473371118833922f0a04492'],
  },

  {
    consoleUserId: '467835003',
    firstName: 'Agency2',
    lastName: 'Sandbox2',
    workmail: 'workmail@example.com',
    password: 'c@@lPassw0rd',
    dateOfBirth: '11-13-1981', // format: MM-DD-YYYY
    gender: 'Male',
    phoneNumber: '0800 000 0000',
    location: 'Abuja',
    activeApp: ['645a25f53a899430e89af2c6'],
  },
];

module.exports = async function seedConsoleUsers() {
  const consoleUserPromises = consoleUsers.map((consoleUser) => {
    const seedConsoleUser = async () => {
      const exists = await ConsoleUser.findOne({ workmail: consoleUser.workmail });
      if (exists) {
        // skip current consoleUser if they already exist
        logger.info(`console user with workmail "${consoleUser.workmail}" already exists, skipping...`);
        return;
      }
      await ConsoleUser.create(consoleUser);
    };

    return seedConsoleUser();
  });
  await Promise.all(consoleUserPromises);
};
