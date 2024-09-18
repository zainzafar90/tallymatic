'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('claim_items', [
      {
        id: '00000000-0000-4000-8000-000000000001',
        claimId: '00000000-0000-4000-8000-000000000001',
        variantId: '00000000-0000-4000-8000-000000000001',
        quantityReported: 5,
        quantityVerified: null,
        notes: 'Items missing from inventory',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('claim_items', null, {});
  },
};
