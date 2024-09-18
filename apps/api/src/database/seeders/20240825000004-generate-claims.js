'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('claims', [
      {
        id: '00000000-0000-4000-8000-000000000001',
        status: 'open',
        type: 'quality',
        dateFiled: new Date(),
        filedBy: '00000000-0000-4000-8000-000000000001',
        description: 'Quality issue with product',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('claims', null, {});
  },
};
