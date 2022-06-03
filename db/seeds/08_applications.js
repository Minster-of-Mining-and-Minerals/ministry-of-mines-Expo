/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('applications').del()
  await knex('applications').insert([
    {id: '14da9652-0495-4ac7-9220-91efd3c8bcfd', res_id: 'b9d6d7e5-a0c2-4eca-86b7-ce008e672606', title: "Jewelry:", description: "Gold's beauty, value and its many other unique qualities make it the material of choice in many industries. Most gold -- 78 percent of the yearly Gold supply -- is made into jewelry."},
    {id: '168aac8d-9577-49e1-8b39-69505fb8eb9e', res_id: '899d8987-1d9a-44dd-8a4f-b44b3df4c094', title: "Jewelry.", description: ""},
    {id: '2040a3f6-f68b-4c04-8661-664d6ffaf0e7', res_id: 'b4b95969-511b-41d1-9f33-a642e5a68aed', title: "Limestone is an important stone for masonry and architecture,", description: "vying with only Granite and Sandstone to be the most commonly used architectural stone."},
    {id: '22647127-6c0c-4617-b1c1-425121adcb5a', res_id: '3754356e-9542-4e6c-b5f8-e811c16ff904', title: "Jewelry:", description: "Gold's beauty, value and its many other unique qualities make it the material of choice in many industries. Most gold -- 78 percent of the yearly Gold supply -- is made into jewelry."},
    {id: '31c4dcc2-9dbf-4366-8739-53c321d9880d', res_id: '775aefd5-5bf0-4d8c-89e0-9e51b2486476', title: "Industrial Processes:", description: "Potassium Nitrate is a key ingredient in the manufacture of explosives, glass and ceramics."},
    {id: '37fdfab4-38bc-4fd7-80f0-0967c4077fd2', res_id: 'd65ada41-44f5-412a-8ed1-0f7390463e33', title: "Jewelry. ", description: "Gold's beauty, value and its many other unique qualities make it the material of choice in many industries. Most gold -- 78 percent of the yearly gold supply -- is made into jewelry."},
    {id: '388bc562-9b74-402f-8a8c-085fab01ee8f', res_id: '886f9bdc-f7e6-42aa-8b89-cef900f187ee', title: "Industrial uses:", description: "Enter application description here"},
    {id: '54062c7e-10c2-4b49-aafa-999c06479c08', res_id: 'd65ada41-44f5-412a-8ed1-0f7390463e33', title: "Electronics.", description: "Gold is used as a contact metal in the electronics industry as it is a good conductor of both electricity and heat."},
    {id: '547f559a-494a-48a6-b308-303b03f6e6f7', res_id: 'abe47542-c3f4-4e84-bca1-6e0bdbfa3304', title: "Electronics.", description: "Tantalum as the metal powder is predominantly used in the electronics industry in the production of capacitors, high-power resistors, amplifiers, alarm systems and timing devices. Because of the size and weight advantages, tantalum capacitors are attractive for portable telephones, personal computers and automotive electronics."},
    {id: '6122a55c-121c-42d1-b3ac-72ea162795b2', res_id: 'b4b95969-511b-41d1-9f33-a642e5a68aed', title: "Cement:", description: "Limestone is a key ingredient of Cement."},
    {id: '80f5d4db-7c8a-4b1a-ab9e-9d372aae8188', res_id: '7d9a8470-015e-49e8-9d7a-f1b4a33a1334', title: "Limestone is an important stone for masonry and architecture,", description: "vying with only granite and sandstone to be the most commonly used architectural stone"},
    {id: '85341a86-091b-4ab4-b2e2-5869841dee0b', res_id: '3754356e-9542-4e6c-b5f8-e811c16ff904', title: "Electronics:", description: "Gold is used as a contact metal in the electronics industry as it is a good conductor of both electricity and heat."},
    {id: '9376dc45-d638-49d6-9353-3222923690b0', res_id: '886f9bdc-f7e6-42aa-8b89-cef900f187ee', title: "Jewelry.", description: ""},
    {id: '9e5e006f-6e8d-4041-b440-5fd5895ad03a', res_id: '7d9a8470-015e-49e8-9d7a-f1b4a33a1334', title: "Plant Nutrition:", description: "Calcium (along with nitrogen, phosphorus, and potassium) is a key mineral to plant nutrition: soils overlying limestone bedrock tend to be pre-fertilized with calcium."},
    {id: 'abb79703-55cc-4106-a6e2-6fa2b9138e0a', res_id: 'b9d6d7e5-a0c2-4eca-86b7-ce008e672606', title: "Electronics:", description: "Gold is used as a contact metal in the electronics industry as it is a good conductor of both electricity and heat."},
    {id: 'ae7f6bac-e433-40fd-8301-2dbe9a3d8358', res_id: '775aefd5-5bf0-4d8c-89e0-9e51b2486476', title: "Fertilizer:", description: "95% of the world's Potash is used in fertilizers. Potash enhances water retention of plants, increases crop yields and plants' disease resistance."},
    {id: 'd18a64b0-8db5-4864-85ae-bff4fd41f192', res_id: '7d9a8470-015e-49e8-9d7a-f1b4a33a1334', title: "Cement:", description: "Limestone is a key ingredient of Cement."},
    {id: 'd569e4e4-ddbb-41ee-896f-21b07a852f8f', res_id: 'b4b95969-511b-41d1-9f33-a642e5a68aed', title: "Plant Nutrition:", description: "Calcium (along with nitrogen, phosphorus, and potassium) is a key mineral to plant nutrition: soils overlying limestone bedrock tend to be pre-fertilized with calcium."},
    {id: 'e0d3437d-04c3-489e-9d88-fa7bb482d973', res_id: 'abe47542-c3f4-4e84-bca1-6e0bdbfa3304', title: "Making Alloys.", description: "Tantalum is also used to produce a variety of alloys that are strong, ductile and have high melting points. Examples include carbide tools for metal working equipment and super alloys for jet engines and nuclear reactors."},
    {id: 'f38606af-cc63-4e11-b594-cac55c67180e', res_id: '775aefd5-5bf0-4d8c-89e0-9e51b2486476', title: "Livestock feed supplements:", description: "Potash contributes to animal growth and milk production."}    
  ]);
};
