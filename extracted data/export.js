require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.SERVER_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Connected to DB");

    // Get all tables
    const [tables] = await connection.query("SHOW TABLES");

    const dbName = process.env.DB_NAME;
    const tableKey = `Tables_in_${dbName}`;

    for (let row of tables) {
      const tableName = row[tableKey];
      console.log(`Exporting: ${tableName}`);

      const [data] = await connection.query(`SELECT * FROM \`${tableName}\``);

      if (data.length === 0) {
        console.log(`Skipping empty table: ${tableName}`);
        continue;
      }

      const filePath = path.join(__dirname, `${tableName}.csv`);

      const csvWriter = createCsvWriter({
        path: filePath,
        header: Object.keys(data[0]).map(col => ({
          id: col,
          title: col
        }))
      });

      await csvWriter.writeRecords(data);
      console.log(`Saved: ${filePath}`);
    }

    await connection.end();
    console.log("✅ All tables exported!");

  } catch (err) {
    console.error("Error:", err);
  }
})();