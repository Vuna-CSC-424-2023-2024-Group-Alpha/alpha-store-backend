//
const { App } = require('../models');
const ApiError = require('../utils/ApiError');

// app.service is a placeholder for any plateform being built
// names can be  modified base on requirement.

const createApp = async (req) => {
  let images;
  // add images to the app object
  if (req.files) {
    images = req.files.map((file) => file.path);
  }

  try {
    const app = await App.create({
      ...req.body,
      images,
    });

    return app;
  } catch (error) {
    console.log(error);
  }
};

const getAllApps = async () => {
  const apps = await App.find();
  return apps;
};

const getApp = async (id) => {
  const app = await App.findOne({ _id: id });
  return app;
};

const updatePortalOtpOption = async (req) => {
  try {
    const { id, portalOtpOption } = req.body;

    const app = await App.findById(id);
    
    if (!app) {
      throw new ApiError(httpStatus.NOT_FOUND, 'App not found ');
    }
    app.portalOtpOption = portalOtpOption;
    return app;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createApp,
  getAllApps,
  getApp,
  updatePortalOtpOption,
};
