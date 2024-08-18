'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'stores',
      [
        {
          id: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4d',
          name: 'Store A',
          location: '...',
          organizationId: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4b',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4e',
          name: 'Store B',
          location: '...',
          organizationId: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4c',
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
