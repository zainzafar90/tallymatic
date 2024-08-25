'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          organizationId: '00000000-0000-4000-8000-000000000001',
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
          id: '00000000-0000-4000-8000-000000000002',
          organizationId: '00000000-0000-4000-8000-000000000001',
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
          id: '00000000-0000-4000-8000-000000000003',
          organizationId: '00000000-0000-4000-8000-000000000001',
          name: 'Member',
          email: 'member@tallymatic.com',
          contact: '...',
          password: '$2a$08$tHoJggaL5aFhM/wEGpVlb.CUPuj5NqdO4EEtE.x37s.FA9U77haYG', // test1234
          isEmailVerified: true,
          role: 'member',
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
