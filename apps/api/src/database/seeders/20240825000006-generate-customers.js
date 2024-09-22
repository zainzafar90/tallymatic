'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const customers = [];
    for (let i = 0; i < 20; i++) {
      customers.push({
        id: faker.datatype.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: '+92-123-456-987',
        address: faker.location.streetAddress(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('customers', customers, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('customers', null, {});
  },
};
