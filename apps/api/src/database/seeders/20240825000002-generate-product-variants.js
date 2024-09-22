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
      price: Math.floor(Math.random() * 500) + 1000,
      costPrice: Math.floor(Math.random() * 500) + 500,
      stock: Math.floor(Math.random() * 100),
      lowStockThreshold: Math.floor(Math.random() * 5),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    productVariants.push({
      id: '00000000-0000-4000-8000-000000000001',
      productId: '00000000-0000-4000-8000-000000000001',
      name: 'Black',
      sku: 'SKU-01',
      price: 1000,
      costPrice: 500,
      stock: 5,
      lowStockThreshold: 1,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    productVariants.push({
      id: '00000000-0000-4000-8000-000000000002',
      productId: '00000000-0000-4000-8000-000000000001',
      name: 'White',
      sku: 'SKU-02',
      price: 1000,
      costPrice: 500,
      stock: 5,
      lowStockThreshold: 1,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('variants', productVariants, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('variants', null, {});
  },
};
