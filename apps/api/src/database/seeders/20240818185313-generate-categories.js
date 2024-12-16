'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const categoryIds = [
      '00000000-0000-4000-8000-000000000001',
      '00000000-0000-4000-8000-000000000002',
      '00000000-0000-4000-8000-000000000003',
    ];

    await queryInterface.bulkInsert(
      'categories',
      [
        {
          id: categoryIds[0],
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: categoryIds[1],
          name: 'Smartphones',
          description: 'Mobile phones and accessories',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: categoryIds[2],
          name: 'Laptops',
          description: 'Portable computers',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    return categoryIds;
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
