'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b1f',
          organizationId: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4b',
          name: 'Super Admin',
          email: 'superadmin@tallymatic.com',
          contact: '...',
          password: '$2a$08$tHoJggaL5aFhM/wEGpVlb.CUPuj5NqdO4EEtE.x37s.FA9U77haYG', // test1234
          isEmailVerified: true,
          role: 'super-admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b2f',
          organizationId: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4b',
          name: 'Admin',
          email: 'admin@tallymatic.com',
          contact: '...',
          password: '$2a$08$tHoJggaL5aFhM/wEGpVlb.CUPuj5NqdO4EEtE.x37s.FA9U77haYG', // test1234
          isEmailVerified: true,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b3f',
          organizationId: 'd3a3b4b6-4b7b-4b7b-9b4b-7b4b7b4b7b4b',
          name: 'User',
          email: 'user@tallymatic.com',
          contact: '...',
          password: '$2a$08$tHoJggaL5aFhM/wEGpVlb.CUPuj5NqdO4EEtE.x37s.FA9U77haYG', // test1234
          isEmailVerified: true,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
