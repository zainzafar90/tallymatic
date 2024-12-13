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
        status: ['draft', 'ordered', 'partial', 'received', 'closed'][Math.floor(Math.random() * 5)],
        totalAmount: (Math.random() * 10000).toFixed(2),
        notes: 'Sample purchase order',
        orderNumber: `#PUR-${i.toString().padStart(4, '0')}`,
        expectedArrivalDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        totalQuantity: 0,
        receivedQuantity: 0,
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

    purchases.forEach((purchase) => {
      purchase.totalQuantity = purchaseItems
        .filter((item) => item.purchaseId === purchase.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      purchase.receivedQuantity = purchaseItems
        .filter((item) => item.purchaseId === purchase.id && item.received)
        .reduce((sum, item) => sum + item.quantity, 0);
    });

    await queryInterface.bulkInsert('purchases', purchases, {});
    await queryInterface.bulkInsert('purchase_items', purchaseItems, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('purchase_items', null, {});
    await queryInterface.bulkDelete('purchases', null, {});
  },
};
