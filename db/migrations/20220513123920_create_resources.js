/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("resources", (table)=>{
        table.uuid("id").primary();
        table.string("name", 45).notNullable();
        table.string("type", 45).notNullable();
        table.string("img_name", 45);
        table.string("img_path", 200);
        table.text("img_data", 'longtext');
        table.string("description", 2000);
        table.string("origin_occ", 1500);
        
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("resources")
};
