/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable("users", (table)=>{
        table.uuid("id").primary();
        table.string("username", 45).unique().notNullable();
        table.text("hash").notNullable();
        table.boolean("is_admin").notNullable().defaultTo(false);
        table.boolean("is_staff").notNullable().defaultTo(false);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users")
};
