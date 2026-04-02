const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('public_resources').del();

  const resourceDir = path.join(__dirname, '../../public/resource');

  // Read all files from public/resource directory
  const files = fs.readdirSync(resourceDir).filter(file => {
    const stat = fs.statSync(path.join(resourceDir, file));
    return stat.isFile();
  });

  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };

  const records = files.map(file => {
    const ext = path.extname(file).toLowerCase();
    const stat = fs.statSync(path.join(resourceDir, file));
    return {
      id: uuidv4(),
      original_name: file,
      filename: file,
      mimetype: mimeTypes[ext] || 'application/octet-stream',
      size_bytes: stat.size,
    };
  });

  // Insert in batches to avoid issues with large inserts
  const batchSize = 50;
  for (let i = 0; i < records.length; i += batchSize) {
    await knex('public_resources').insert(records.slice(i, i + batchSize));
  }

  console.log(`Seeded ${records.length} public resources`);
};
