/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("public_resources", (table) => {
        table.uuid("id").primary();
        table.string("original_name", 255);
        table.string("filename", 255).notNullable().unique();
        table.string("mimetype", 100);
        table.integer("size_bytes");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("public_resources");
};
