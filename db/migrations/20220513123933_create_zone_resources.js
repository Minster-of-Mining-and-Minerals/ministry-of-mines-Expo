/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("zone_resources", (table)=>{
        table.uuid("id").primary();
        table.uuid("zone_id").references("zones.id").onDelete("CASCADE");
        table.uuid("res_id").references("resources.id").onDelete("CASCADE");
        table.timestamp("updated_at");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("zone_resources")
};
