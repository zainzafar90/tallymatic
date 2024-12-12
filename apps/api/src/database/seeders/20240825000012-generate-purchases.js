'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const suppliers = await queryInterface.sequelize.query(`SELECT id FROM suppliers;`);
    const supplierRows = suppliers[0];

    const organizations = await queryInterface.sequelize.query(`SELECT id FROM organizations;`);
    const organizationRows = organizations[0];

    const purchases = [];
    const purchaseItems = [];
    const variants = await queryInterface.sequelize.query(`SELECT id FROM variants;`);
    const variantRows = variants[0];

    for (let i = 0; i < 10; i++) {
      const purchaseId = i === 0 ? '00000000-0000-4000-8000-000000000001' : uuidv4();

      purchases.push({
        id: purchaseId,
        organizationId: organizationRows[0].id,
        supplierId: supplierRows[Math.floor(Math.random() * supplierRows.length)].id,
        status: ['draft', 'pending', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
        totalAmount: (Math.random() * 10000).toFixed(2),
        notes: 'Sample purchase order',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Generate 1-5 items for each purchase
      const itemCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < itemCount; j++) {
        const quantity = Math.floor(Math.random() * 10) + 1;
        const unitCost = (Math.random() * 100).toFixed(2);
        purchaseItems.push({
          id: uuidv4(),
          purchaseId,
          variantId: variantRows[Math.floor(Math.random() * variantRows.length)].id,
          quantity,
          unitCost,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('purchases', purchases, {});
    await queryInterface.bulkInsert('purchase_items', purchaseItems, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('purchase_items', null, {});
    await queryInterface.bulkDelete('purchases', null, {});
  },
};
