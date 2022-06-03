/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('zone_resources').del()
  await knex('zone_resources').insert([
    {id: 'bede76e2-f567-445a-bf57-c6ecd7d80dc9', zone_id: '030d3863-291c-432f-8f5d-0ac35af93f0d', res_id: '886f9bdc-f7e6-42aa-8b89-cef900f187ee'},
    {id: 'f29c81ad-1e1f-48bb-bc79-c9949df995cc', zone_id: '030d3863-291c-432f-8f5d-0ac35af93f0d', res_id: '7d9a8470-015e-49e8-9d7a-f1b4a33a1334'},
    {id: '55e13b60-14e2-4a73-a6b2-3a8eab81f986', zone_id: '030d3863-291c-432f-8f5d-0ac35af93f0d', res_id: 'd65ada41-44f5-412a-8ed1-0f7390463e33'},
    {id: 'da9a4f61-888a-4c6f-ba2c-d4ec11ab269a', zone_id: '8005ede0-8c4d-418e-8c1a-2a5303d22322', res_id: '775aefd5-5bf0-4d8c-89e0-9e51b2486476'},
    {id: 'a0a2b8bc-62fe-4178-9128-9d65a863300b', zone_id: 'df2325cb-b18c-4691-9cb2-2e07f40e123a', res_id: 'b4b95969-511b-41d1-9f33-a642e5a68aed'},
    {id: '75051249-b0c9-43be-b058-dc0a070ff665', zone_id: '1117f076-a0dc-492d-aed1-c284fccd21ae', res_id: 'b9d6d7e5-a0c2-4eca-86b7-ce008e672606'},
    {id: '8f7dfa4b-0ef4-486b-a9ee-c6237cd902eb', zone_id: '5bea1e5b-2019-4f88-bd78-356f79869079', res_id: 'abe47542-c3f4-4e84-bca1-6e0bdbfa3304'},
    {id: '1a8f5300-8f16-4e8e-9241-f0498a5add32', zone_id: '5bea1e5b-2019-4f88-bd78-356f79869079', res_id: '899d8987-1d9a-44dd-8a4f-b44b3df4c094'},
    {id: '34545812-b82c-4a5f-9b45-39a6a9c1c448', zone_id: '5bea1e5b-2019-4f88-bd78-356f79869079', res_id: '3754356e-9542-4e6c-b5f8-e811c16ff904'},
  ]);
};

