'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const products = await queryInterface.sequelize.query(`SELECT id FROM products;`);
    const productRows = products[0];

    const productVariants = productRows.map((product, index) => ({
      id: uuidv4(),
      productId: product.id,
      name: `Variant ${index + 1}`,
      sku: `SKU-${index + 1}`,
      price: Math.floor(Math.random() * 1000) + 1,
      costPrice: Math.floor(Math.random() * 1000) + 1,
      stock: Math.floor(Math.random() * 6),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('variants', productVariants, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('variants', null, {});
  },
};
