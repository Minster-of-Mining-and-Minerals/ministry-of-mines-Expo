const { parseCSV } = require('../csv-helper');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('zone_resources').del();

  const rows = parseCSV('zone_resources.csv');

  const records = rows.map(row => ({
    id: row.id,
    zone_id: row.zone_id,
    res_id: row.res_id,
  }));

  // Insert in batches
  const batchSize = 20;
  for (let i = 0; i < records.length; i += batchSize) {
    await knex('zone_resources').insert(records.slice(i, i + batchSize));
  }

  console.log(`Seeded ${records.length} zone_resources`);
};
