/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("applications", (table)=>{
        table.uuid("id").primary();
        table.uuid("res_id").references("resources.id").onDelete("CASCADE");
        table.string("title", 100).notNullable();
        table.string("description", 1500).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("applications")
};
