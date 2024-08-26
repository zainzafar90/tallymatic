'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      contact: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: Sequelize.ENUM('member', 'admin', 'super-admin'),
        allowNull: false,
        defaultValue: 'member',
      },
      organizationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ADD CONSTRAINT check_password_length
      CHECK (LENGTH(password) >= 8 AND LENGTH(password) <= 128);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ADD CONSTRAINT check_password_complexity
      CHECK (password ~ '^(?=.*[a-zA-Z])(?=.*[0-9])');
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
