'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'organizations',
      [
        {
          id: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4b',
          name: 'Catalyst Solutions',
          status: 'active',
          description: '...',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4c',
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
