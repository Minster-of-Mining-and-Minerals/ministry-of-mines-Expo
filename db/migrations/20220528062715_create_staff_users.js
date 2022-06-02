/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("staff_users", (table)=>{
        table.uuid("id").primary();
        table.uuid("user_id").references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("first_name", 45);
        table.string("last_name", 45);
        table.string("email", 45).unique();
        table.string("role", 45);
        table.string("organization", 80);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("staff_users")
};
