const { App } = require('../models');
const ApiError = require('../utils/ApiError');

//Disabled by default unless needed!"

// const createApp = async (req) => {
//   let images;
//   // add images to the app object
//   if (req.files) {
//     images = req.files.map((file) => file.path);
//   }

//   try {
//     const app = await App.create({
//       ...req.body,
//       images,
//     });

//     return app;
//   } catch (error) {
//     console.log(error);
//   }
// };

const getAllApps = async () => {
  const apps = await App.find();
  return apps;
};

const getApp = async (id) => {
  const app = await App.findOne({ _id: id });
  return app;
};

const getAppBySlug = async (slug) => {
  return await App.findOne({ slug });
}

const updatePortalOtpOption = async (req) => {
  try {
    const { id, portalOtpOption } = req.body;

    const app = await App.findByIdAndUpdate(id, { portalOtpOption }, { new: true });

    if (!app) {
      throw new ApiError(httpStatus.NOT_FOUND, 'App not found ');
    }

    return app;
  } catch (error) {
    console.log(error);
  }
};

const updateAppStatus = async (appId, body) => {
  const app = await App.findOne({ _id: appId });
  if (!app) {
    throw new ApiError(httpStatus.NOT_FOUND, 'App not found');
  }

  if (body.portalStatus) {
    app.status.portal = body.portalStatus;
  }
  if (body.websiteStatus) {
    app.status.website = body.websiteStatus;
  }

  await app.save();
  return app;
};

module.exports = {
  // createApp,
  getAllApps,
  getApp,
  getAppBySlug,
  updatePortalOtpOption,
  updateAppStatus,
};
