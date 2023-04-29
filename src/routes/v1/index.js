const express = require('express');
const portalAuthRoute = require('./portal.auth.route');
const portalUserRoute = require('./portal.user.route');
const consoleAuthRoute = require('./console.auth.route');
const consoleUserRoute = require('./console.user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/portal/auth',
    route: portalAuthRoute,
  },
  {
    path: '/portal/users',
    route: portalUserRoute,
  },
  {
    path: '/console/auth',
    route: consoleAuthRoute,
  },
  {
    path: '/console/teams',
    route: consoleUserRoute,
  },
];



const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];


router.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = error;
    res.status(503).send();
  }
});


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
