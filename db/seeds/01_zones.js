/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('zones').del()
  await knex('zones').insert([
    {id: '030d3863-291c-432f-8f5d-0ac35af93f0d', Name: 'Northern Zone', Area: '140,770', Status: 'Advanced Stage Exploration', Description: 'Located in north Ethiopia, the Northern Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particularly known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron.'},
    {id: '1117f076-a0dc-492d-aed1-c284fccd21ae', Name: 'Western Zone', Area: '146,551', Status: 'Early Stage Exploration', Description: 'Located in western Ethiopia, the Western Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron'},
    {id: '5bea1e5b-2019-4f88-bd78-356f79869079', Name: 'Southern Zone', Area: '221,146', Status: 'Advanced Stage Exploration', Description: 'Located in southern Ethiopia, the Southern Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron'},
    {id: '8005ede0-8c4d-418e-8c1a-2a5303d22322', Name: 'North-Eastern Zone', Area: '114,646', Status: 'Early Stage Exploration', Description: 'Located in north-eastern Ethiopia, the North-East Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron'},
    {id: 'df2325cb-b18c-4691-9cb2-2e07f40e123a', Name: 'Eastern Zone', Area: '302,576', Status: 'Advanced Stage Exploration', Description: 'Located in eastern Ethiopia, the Eastern Zone is home to low grade Volcano-Sedimentary rocks, high grade Gneisses and Intrusives. This zone is particulary known for its rich deposits of Gold and Base Metals such as Copper, Coal, Marble, Granite and Iron'}
  ]);
};
