'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('customers', [
      {
        id: '00000000-0000-4000-8000-000000000001',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phone: '1234567890',
        address: '123 Main St, Springfield, IL 62701',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('customers', null, {});
  },
};
