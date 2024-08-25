'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'organizations',
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          name: 'Catalyst Solutions',
          status: 'active',
          description: '...',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '00000000-0000-4000-8000-000000000002',
          name: 'Omniflow Technologies',
          status: 'active',
          description: '...',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('organizations', null, {});
  },
};
