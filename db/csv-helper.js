const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Parse a CSV file from the 'extracted data' directory
 * @param {string} filename - The CSV filename (e.g., 'resources.csv')
 * @returns {Array<Object>} Array of parsed records
 */
function parseCSV(filename) {
  // From /app/db/csv-helper.js, 'extracted data' is at /app/extracted data/
  const csvPath = path.join(__dirname, '../extracted data', filename);
  const content = fs.readFileSync(csvPath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });
}

/**
 * Convert a Cloudinary URL to a local resource path
 * e.g., 'https://res.cloudinary.com/amronb1230/image/upload/v1654156930/psk1wevd4wh91a5zho1s.png'
 *    -> '/resource/psk1wevd4wh91a5zho1s.png'
 */
function cloudinaryToLocal(url) {
  if (!url || !url.includes('cloudinary')) return url;
  const filename = url.split('/').pop();
  return `/resource/${filename}`;
}

module.exports = { parseCSV, cloudinaryToLocal };
