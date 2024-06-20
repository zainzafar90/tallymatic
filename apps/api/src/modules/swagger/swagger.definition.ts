import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Tallymatic API Documentation',
    version: '0.0.1',
    description: 'API Documentation for Tallymatic',
    license: {
      name: 'MIT',
      url: 'https://github.com/zainzafar90/tallymatic.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
