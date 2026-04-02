const { parseCSV, cloudinaryToLocal } = require('../csv-helper');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('resources').del();

  const rows = parseCSV('resources.csv');

  const records = rows.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type,
    img_path: cloudinaryToLocal(row.img_path),
    description: row.description,
    origin_occ: row.origin_occ,
  }));

  // Insert in batches
  const batchSize = 20;
  for (let i = 0; i < records.length; i += batchSize) {
    await knex('resources').insert(records.slice(i, i + batchSize));
  }

  console.log(`Seeded ${records.length} resources`);
};
