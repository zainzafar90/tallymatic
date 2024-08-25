'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const organizations = await queryInterface.sequelize.query(`SELECT id FROM organizations;`);
    const organizationRows = organizations[0];

    const stores = await queryInterface.sequelize.query(`SELECT id FROM stores;`);
    const storeRows = stores[0];

    await queryInterface.bulkInsert(
      'products',
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          organizationId: organizationRows[0].id,
          storeId: storeRows[0].id,
          name: 'Product A',
          description: 'Description for Product A',
          price: 19.99,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000002',
          organizationId: organizationRows[0].id,
          storeId: storeRows[0].id,
          name: 'Product B',
          description: 'Description for Product B',
          price: 29.99,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000003',
          organizationId: organizationRows[1].id,
          storeId: storeRows[1].id,
          name: 'Product C',
          description: 'Description for Product C',
          price: 39.99,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
