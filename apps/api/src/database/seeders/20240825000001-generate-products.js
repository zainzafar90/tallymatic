'use strict';

const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const organizations = await queryInterface.sequelize.query(`SELECT id FROM organizations;`);
    const organizationRows = organizations[0];

    const stores = await queryInterface.sequelize.query(`SELECT id FROM stores;`);
    const storeRows = stores[0];

    const categories = await queryInterface.sequelize.query(`SELECT id FROM categories;`);
    const categoryRows = categories[0];

    const products = [];

    products.push({
      id: '00000000-0000-4000-8000-000000000001',
      organizationId: organizationRows[0].id,
      categoryId: categoryRows[0].id,
      storeId: storeRows[0].id,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (let i = 0; i < 100; i++) {
      const randomOrganization = faker.helpers.arrayElement(organizationRows);
      const randomStore = faker.helpers.arrayElement(storeRows);

      products.push({
        id: uuidv4(),
        organizationId: randomOrganization.id,
        categoryId: categoryRows[0].id,
        storeId: randomStore.id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        status: faker.helpers.arrayElement(['active', 'draft', 'archived']),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
