'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('suppliers', [
      {
        id: '00000000-0000-4000-8000-000000000001',
        companyName: 'ACME Inc.',
        email: 'acme@company.com',
        contactName: 'John Doe',
        phone: '1234567890',
        address: '123 Main St, Springfield, IL 62701',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('suppliers', null, {});
  },
};
