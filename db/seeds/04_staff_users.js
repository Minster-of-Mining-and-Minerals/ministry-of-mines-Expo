/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('staff_users').del()
    await knex('staff_users').insert([
      {id: 'd1d67ea5-0349-4662-8ea2-acc55d46bca7', user_id: '67aa1870-be1a-4cca-a0ee-bd05582e495e', first_name: 'John', last_name: 'Doe',email: 'test@test.com', role: 'Software Engineer', organization: 'Ministry of Mines and Petroleum'}
    ]);
  };
  