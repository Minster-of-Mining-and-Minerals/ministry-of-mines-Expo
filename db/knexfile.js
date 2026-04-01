const path = require("path");

require("dotenv").config({path: '../.env'});



/**
 * knexfile - This file will be used to create the connection to the database
 */
 module.exports = {
    // Initialize knex
    development: {
      client: "pg",
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
      },
      useNullAsDefault: true,
      migrations: {
        tableName: "knex_migrations",
        directory: path.join(__dirname, '/migrations'),
      },
      seeds: {
        directory: path.join(__dirname, '/seeds'),
      }
    },
  };