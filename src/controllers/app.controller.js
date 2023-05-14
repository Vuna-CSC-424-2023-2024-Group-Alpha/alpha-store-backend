const { appService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getApp = catchAsync(async (req, res) => {
  const app = await appService.getApp();
  res.json({ app });
});

const getAllApps = catchAsync(async (req, res) => {
  const apps = await appService.getAllApps();
  res.json({ apps });
});

const createApp = catchAsync(async (req, res) => {
  const app = await appService.createApp(req);
  res.json({ app });
});

const updatePortalOtpOption = catchAsync(async (req, res) => {
  const app = await appService.updatePortalOtpOption(req);
  res.json({ app });
});

module.exports = {
  getApp,
  getAllApps,
  createApp,
  updatePortalOtpOption,
};
