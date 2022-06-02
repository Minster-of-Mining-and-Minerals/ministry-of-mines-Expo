/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("gallery_users", (table)=>{
        table.uuid("id").primary();
        table.uuid("user_id").references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("role", 45);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("gallery_users")
};
