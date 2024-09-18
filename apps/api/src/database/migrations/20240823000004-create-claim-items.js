'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('claim_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      claimId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'claims',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      variantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'variants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantityReported: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantityVerified: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('claim_items');
  },
};
