//
const { App } = require('../models');

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

const getApps = async () => {
  const apps = await App.find();
  return apps;
};

const getAppById = async (id) => {
  const app = await App.findOne({ _id: id });
  return app;
};

module.exports = {
  createApp,
  getApps,
  getAppById,
};
