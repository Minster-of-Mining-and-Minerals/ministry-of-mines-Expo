/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("admin_user", (table)=>{
        table.uuid("id").primary();
        table.uuid("user_id").references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("admin_user")
};
