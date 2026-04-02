const { parseCSV } = require('../csv-helper');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('properties').del();

  const rows = parseCSV('properties.csv');

  const records = rows.map(row => ({
    id: row.id,
    res_id: row.res_id,
    title: row.title,
    description: row.description,
  }));

  // Insert in batches
  const batchSize = 20;
  for (let i = 0; i < records.length; i += batchSize) {
    await knex('properties').insert(records.slice(i, i + batchSize));
  }

  console.log(`Seeded ${records.length} properties`);
};
