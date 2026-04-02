const { parseCSV } = require('../csv-helper');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('zones').del();

  const rows = parseCSV('zones.csv');

  const records = rows.map(row => ({
    id: row.id,
    Name: row.Name,
    Area: row.Area,
    Status: row.Status,
    Description: row.Description,
  }));

  await knex('zones').insert(records);
  console.log(`Seeded ${records.length} zones`);
};
