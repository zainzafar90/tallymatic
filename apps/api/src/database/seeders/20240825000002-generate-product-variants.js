'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const products = await queryInterface.sequelize.query(`SELECT id FROM products;`);
    const productRows = products[0];

    await queryInterface.bulkInsert(
      'product_variants',
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          productId: productRows[0].id,
          name: 'Variant A1',
          sku: 'SKU-A1',
          price: 24.99,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000002',
          productId: productRows[0].id,
          name: 'Variant A2',
          sku: 'SKU-A2',
          price: 22.99,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000003',
          productId: productRows[1].id,
          name: 'Variant B1',
          sku: 'SKU-B1',
          price: 34.99,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('product_variants', null, {});
  },
};
