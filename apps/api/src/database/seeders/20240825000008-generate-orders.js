'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const customers = await queryInterface.sequelize.query(`SELECT id FROM customers;`);
    const customerRows = customers[0];

    const stores = await queryInterface.sequelize.query(`SELECT id FROM stores;`);
    const storeRows = stores[0];

    const orders = [];

    for (let i = 0; i < 20; i++) {
      orders.push({
        id: i === 0 ? '00000000-0000-4000-8000-000000000001' : uuidv4(),
        customerId: customerRows[Math.floor(Math.random() * customerRows.length)].id,
        storeId: storeRows[Math.floor(Math.random() * storeRows.length)].id,
        orderNumber: `ORD-${1000 + i}`,
        closedAt: null,
        currency: 'PKR',
        status: ['pending', 'paid', 'unpaid', 'partiallyPaid', 'refunded', 'voided'][Math.floor(Math.random() * 6)],
        totalAmount: (Math.random() * 1000).toFixed(2),
        subtotal: (Math.random() * 900).toFixed(2),
        taxAmount: (Math.random() * 50).toFixed(2),
        discountAmount: (Math.random() * 50).toFixed(2),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('orders', orders, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('orders', null, {});
  },
};
