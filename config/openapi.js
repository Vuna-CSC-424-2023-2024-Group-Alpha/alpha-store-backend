const config = require('config');
const swaggerJSDoc = require('swagger-jsdoc');

const openAPIDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Boilerplate API',
    description: 'Boilerplate API.',
    version: '0.0.0',
    contact: {
      name: 'Boilerplate',
      url: 'https://boilerplate.haqqman.agency',
      email: 'contact@haqqman.com',
    },
  },
  servers: [
    {
      url: `${config.app.url}:${config.app.port}/${config.api.version}/`,
    },
  ],
};

module.exports = swaggerJSDoc({
  definition: openAPIDocument,
  apis: ['./src/api-doc/**/*.yml'],
});
