'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const products = await queryInterface.sequelize.query(`SELECT id FROM products;`);
    const productRows = products[0];

    let productVariants = productRows.map((product, index) => ({
      id: index === 0 ? '00000000-0000-4000-8000-000000000001' : uuidv4(),
      productId: product.id,
      name: faker.color.human(),
      sku: `SKU-${index + 1}`,
      price: Math.floor(Math.random() * 500) + 1000,
      costPrice: Math.floor(Math.random() * 500) + 500,
      stock: Math.floor(Math.random() * 100),
      lowStockThreshold: Math.floor(Math.random() * 5),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    productVariants = productVariants.concat(
      productRows.map((product, index) => ({
        id: uuidv4(),
        productId: product.id,
        name: faker.color.human(),
        sku: `SKU-${index + 201}`,
        price: Math.floor(Math.random() * 500) + 1000,
        costPrice: Math.floor(Math.random() * 500) + 500,
        stock: Math.floor(Math.random() * 100),
        lowStockThreshold: Math.floor(Math.random() * 5),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    await queryInterface.bulkInsert('variants', productVariants, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('variants', null, {});
  },
};
