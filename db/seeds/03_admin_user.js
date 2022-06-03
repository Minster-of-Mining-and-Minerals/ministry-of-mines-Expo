/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('admin_user').del()
    await knex('admin_user').insert([
      {id: '29f90d59-5369-443d-b48f-1db170707ec9', user_id: '570dcac4-1782-4baa-98c2-72c09df05a69'}
      
    ]);
  };
  
