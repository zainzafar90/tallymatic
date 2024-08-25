'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const products = await queryInterface.sequelize.query(`SELECT id FROM products;`);
    const productRows = products[0];

    await queryInterface.bulkInsert(
      'product_options',
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          productId: productRows[0].id,
          name: 'Size',
          description: 'Size options',
          priceModifier: 0,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000002',
          productId: productRows[0].id,
          name: 'Color',
          description: 'Color options',
          priceModifier: 2.0,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000003',
          productId: productRows[1].id,
          name: 'Material',
          description: 'Material options',
          priceModifier: 5.0,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('product_options', null, {});
  },
};
