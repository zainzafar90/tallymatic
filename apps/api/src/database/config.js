require('dotenv').config();

const config = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'tallymatic',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  port: process.env.DB_PORT || 5432,
};

module.exports = config;
