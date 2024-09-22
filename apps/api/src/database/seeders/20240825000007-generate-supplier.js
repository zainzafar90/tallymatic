'use strict';
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const suppliers = [];
    for (let i = 0; i < 20; i++) {
      suppliers.push({
        id: i === 0 ? '00000000-0000-4000-8000-000000000001' : uuidv4(),
        companyName: faker.company.name(),
        email: faker.internet.email(),
        contactName: faker.person.fullName(),
        phone: '+92-123-456-987',
        address: faker.location.streetAddress(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('suppliers', suppliers, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('suppliers', null, {});
  },
};
