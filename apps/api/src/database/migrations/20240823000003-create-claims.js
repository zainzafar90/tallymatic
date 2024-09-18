'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('claims', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('shortage', 'overage', 'damage', 'quality', 'other'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('open', 'investigating', 'resolved', 'rejected'),
        allowNull: false,
        defaultValue: 'open',
      },
      dateFiled: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateResolved: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      filedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      assignedTo: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      resolution: {
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
    await queryInterface.dropTable('claims');
  },
};
