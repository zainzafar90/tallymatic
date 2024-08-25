'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'stores',
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          name: 'Store A',
          location: '...',
          organizationId: '00000000-0000-4000-8000-000000000001',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000002',

          name: 'Store B',
          location: '...',
          organizationId: '00000000-0000-4000-8000-000000000001',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('stores', null, {});
  },
};
