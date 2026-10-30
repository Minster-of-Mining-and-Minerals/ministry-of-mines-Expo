const knex = require('knex');
const knexfile = require('./knexfile');
const {Model} = require('objection');

function setupDB() {
    const db = knex(knexfile[process.env.NODE_ENV] || knexfile.development);
    Model.knex(db);
    return db;
}

module.exports = setupDB;