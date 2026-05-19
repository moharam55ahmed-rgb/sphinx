const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SPHINX Real Estate API',
      version: '1.0.0',
      description: 'API Documentation for SPHINX Real Estate Backend',
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
