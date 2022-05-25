const path = require("path");

require("dotenv").config();



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
        user: 'root',
        password: 'P@ssw0rd',
        database: 'mineral_explorer',
      },
      migrations: {
        tableName: "knex_migrations",
        directory: path.join(__dirname, '/migrations'),
      },
    },
  };