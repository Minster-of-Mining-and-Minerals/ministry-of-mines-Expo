/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('gallery_users').del()
    await knex('gallery_users').insert([
      {id: '0958a245-c43d-4a87-895f-6f8d388d4a6b', user_id: '13ac3d1b-36bf-448b-921e-2bbe53bf7037', role: 'North-East'},
      {id: '1bf5b634-5e30-4f39-8016-282c617a347c', user_id: 'ae8ea0ff-6d67-49b8-ab52-2560f16bbd17', role: 'South'},
      {id: '46574b32-c1b7-4195-adae-462510e92930', user_id: 'd58aedb1-bd2f-4eef-b195-44824508645f', role: 'East'},
      {id: '90bbd2e4-dcb6-4e77-9822-bed9aada5525', user_id: 'a9d57b5b-9e45-4eed-8619-6cf654254f10', role: 'Instructor'},
      {id: 'c4381f25-7462-44bd-a1aa-a4db759a5811', user_id: '51e00c6a-187d-47a9-a403-6b1f7317e43d', role: 'North'},
      {id: 'ce3b4bca-e427-4f91-8f52-2463dde632d9', user_id: 'e47b9c0a-e6dc-4ff7-80c4-0850eae11397', role: 'West'},
    ]);
  };
  