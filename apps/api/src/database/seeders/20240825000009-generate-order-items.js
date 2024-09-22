'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const orders = await queryInterface.sequelize.query(`SELECT id FROM orders;`);
    const orderRows = orders[0];

    const variants = await queryInterface.sequelize.query(`SELECT id FROM variants;`);
    const variantRows = variants[0];

    const orderItems = [];

    for (const order of orderRows) {
      const itemCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < itemCount; i++) {
        orderItems.push({
          id: uuidv4(),
          orderId: order.id,
          variantId: variantRows[Math.floor(Math.random() * variantRows.length)].id,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: (Math.random() * 100).toFixed(2),
          totalDiscount: (Math.random() * 10).toFixed(2),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('order_items', orderItems, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('orders', null, {});
  },
};
