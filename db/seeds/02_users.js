/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: '570dcac4-1782-4baa-98c2-72c09df05a69', username: 'admin', hash: '$2b$10$50ZtHOid6pyB2rqLqRFJsO0y8OkNbZZE2BCfBC9tn.gHvbXYzfdGO', is_admin: true, is_staff: false},
    {id: '67aa1870-be1a-4cca-a0ee-bd05582e495e', username: 'staff', hash: '$2b$10$cW4.uuzXwPxgCl.MZoi4wuNji5gWIjU8kmBS06Af4e76oGTUWB8tS', is_admin: false, is_staff: true}
  ]);
};
