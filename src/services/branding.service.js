//
const { Branding } = require('../models');

const createBrand = async (req) => {
  let images;
  // add images to the brand object
  if (req.files) {
    images = req.files.map((file) => file.path);
  }

  try {
    const branding = await Branding.create({
      ...req.body,
      images,
    });

    return branding;
  } catch (error) {
    console.log(error);
  }
};

const getBrands = async () => {
  const brandings = await Branding.find();
  return brandings;
};

const getBrandingById = async (id) => {
  const branding = await Branding.findOne({ _id: id });
  return branding;
};

module.exports = {
  createBrand,
  getBrands,
  getBrandingById,
};
