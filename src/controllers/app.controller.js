const { appService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getApp = catchAsync(async (req, res) => {
  const { id } = req.params;
  const app = await appService.getApp(id);
  res.json({ app });
});

const getAllApps = catchAsync(async (req, res) => {
  const apps = await appService.getAllApps();
  res.json({ apps });
})

//Disabled by default unless needed!"
// const createApp = catchAsync(async (req, res) => {
//   const app = await appService.createApp(req);
//   res.json({ app });
// });

const updatePortalOtpOption = catchAsync(async (req, res) => {
  const app = await appService.updatePortalOtpOption(req);
  res.json({ app });
});

const updateAppStatus = catchAsync(async (req, res) => {
  const app = await appService.updateAppStatus(req.params.appId, req.body);
  res.json({ app });
});

module.exports = {
  getApp,
  getAllApps,
  // createApp,
  updatePortalOtpOption,
  updateAppStatus,
};
