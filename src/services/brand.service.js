//
const { Brand } = require('../models');

const createBrand = async (req) => {
  let images;
  // add images to the brand object
  if (req.files) {
    images = req.files.map((file) => file.path);
  }

  try {
    const brand = await Brand.create({
      ...req.body,
      images,
    });

    return brand;
  } catch (error) {
    console.log(error);
  }
};

const getBrands = async () => {
  const brands = await Brand.find();
  return brands;
};

const getBrandById = async (id) => {
  const brand = await Brand.findOne({ _id: id });
  return brand;
};

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
};
