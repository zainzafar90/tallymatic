'use strict';

module.exports = {
  async up(queryInterface) {
    const [variants] = await queryInterface.sequelize.query(`SELECT id FROM variants;`);

    const inventoryRecords = variants.map((variant) => ({
      id: variant.id,
      variantId: variant.id,
      quantity: Math.floor(Math.random() * 100),
      type: 'received',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('inventories', inventoryRecords);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('inventories', null, {});
  },
};
