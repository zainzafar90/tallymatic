'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const products = await queryInterface.sequelize.query(`SELECT id FROM products;`);
    const productRows = products[0];

    const categories = await queryInterface.sequelize.query(`SELECT id FROM categories;`);
    const categoryRows = categories[0];

    await queryInterface.bulkInsert(
      'product_categories',
      [
        {
          id: uuidv4(),
          productId: productRows[0].id,
          categoryId: categoryRows[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          productId: productRows[1].id,
          categoryId: categoryRows[2].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          productId: productRows[2].id,
          categoryId: categoryRows[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('product_categories', null, {});
  },
};
