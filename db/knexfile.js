const path = require("path");

require("dotenv").config({path: '../.env'});



/**
 * knexfile - This file will be used to create the connection to the database
 */
 module.exports = {
    // Initialize knex
    development: {
      client: "sqlite3",
      connection: {
        filename: path.join(__dirname, 'dev.sqlite3'),
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