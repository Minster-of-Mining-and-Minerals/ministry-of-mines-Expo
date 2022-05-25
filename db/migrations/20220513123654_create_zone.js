/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("zones", (table)=>{
        table.uuid("id").primary();
        table.string("Name", 45).notNullable();
        table.string("Area", 45).notNullable();
        table.string("Status", 45);
        table.string("Description", 350);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("zones")
};
