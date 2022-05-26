const path = require("path");

require("dotenv").config({path: '../.env'});



/**
 * knexfile - This file will be used to create the connection to the database
 */
 module.exports = {
    // Initialize knex
    development: {
      client: "mysql2",
      connection: {
        host: 'localhost',
        port: 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      migrations: {
        tableName: "knex_migrations",
        directory: path.join(__dirname, '/migrations'),
      },
    },
  };