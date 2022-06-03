/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: '13ac3d1b-36bf-448b-921e-2bbe53bf7037', username: 'north-east', hash: '$2b$10$LVPUHkD5H9OORQQfW2cScemTD3qfpJcHSDXu9P/o0DRu/daXOwtIO', is_admin: false, is_staff: false},
    {id: '51e00c6a-187d-47a9-a403-6b1f7317e43d', username: 'north', hash: '$2b$10$i3QURHU.lHuzn90tHycMB.oBAkJ3mgjzmBLADqKC.CmIwE5myTlpK', is_admin: false, is_staff: false},
    {id: '570dcac4-1782-4baa-98c2-72c09df05a69', username: 'admin', hash: '$2b$10$50ZtHOid6pyB2rqLqRFJsO0y8OkNbZZE2BCfBC9tn.gHvbXYzfdGO', is_admin: true, is_staff: false},
    {id: '67aa1870-be1a-4cca-a0ee-bd05582e495e', username: 'staff', hash: '$2b$10$cW4.uuzXwPxgCl.MZoi4wuNji5gWIjU8kmBS06Af4e76oGTUWB8tS', is_admin: false, is_staff: true},
    {id: 'a9d57b5b-9e45-4eed-8619-6cf654254f10', username: 'instructor', hash: '$2b$10$epU7h4m5tQNeVydieFb.1O2.pS5aAdPDacZ4661kMrmOJCZaXXWBW', is_admin: false, is_staff: false},
    {id: 'ae8ea0ff-6d67-49b8-ab52-2560f16bbd17', username: 'south', hash: '$2b$10$AKlzJrP/kHgn7qE1ELA0E.Vv/vbCRioaiszIcuizdi9NzpVjQMZKO', is_admin: false, is_staff: false},
    {id: 'd58aedb1-bd2f-4eef-b195-44824508645f', username: 'east', hash: '$2b$10$fFkCDvH2WZOzTKxx5DEBOeAeJgSijztuqVRGMqtmD5Gm9Bzo/Ovyy', is_admin: false, is_staff: false},
    {id: 'e47b9c0a-e6dc-4ff7-80c4-0850eae11397', username: 'west', hash: '$2b$10$w4vIitk8.7YkjvJBtX2Iw.F.ySsBtD.H5tNxFg8SRhw4KZRO0t.rq', is_admin: false, is_staff: false}
  ]);
};
