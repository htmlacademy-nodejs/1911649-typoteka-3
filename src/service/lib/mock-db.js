'use strict';

const Sequelize = require(`sequelize`);

const {DB_NAME_TEST, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

module.exports = new Sequelize(
    DB_NAME_TEST, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      },
      logging: false});