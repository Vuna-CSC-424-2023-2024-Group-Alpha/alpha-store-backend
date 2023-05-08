const mongoose = require('mongoose');
const { Branding } = require('../models');
const logger = require('../config/logger');

const brandings = [
  {
    name: 'Great Brand',
    code: 'GB',
    address: 'Abuja Nigeria',
    contactPerson: 'Great Brand',
    phoneNumber: '081 300 0000',
    email: 'contact.greatBrand@haqqman.com',
    description: 'we deal in all household items',
    portalUrl: 'portal.greatbrand.ng',
    consoleUrl: 'console.greatbrand.ng',
    brandSettings: {
      logoEmail: 'https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png',
    },
  },
  {
    name: 'Kitchen Brand',
    code: 'KB',
    address: 'Abuja Nigeria',
    contactPerson: 'Great Brand',
    phoneNumber: '081 300 0001',
    email: 'contact.kitchenbrand@haqqman.com',
    description: 'we deal in all kitchen items',
    portalUrl: 'portal.kitchenbrand.ng',
    consoleUrl: 'console.kitchenbrand.ng',
    brandSettings: {
    logoEmail: 'https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png',
    },
  },
];

module.exports = async function seedbrandings() {
  const brandingPromises = brandings.map((branding) => {
    const seedBranding = async () => {
      const exists = await Branding.findOne({ name: branding.name });
      if (exists) {
        // skip current brand if they already exist
        logger.info(`Branding with name "${branding.name}" already exists, skipping...`);
        return;
      }
      await Branding.create(branding);
    };

    return seedBranding();
  });
  await Promise.all(brandingPromises);
};
