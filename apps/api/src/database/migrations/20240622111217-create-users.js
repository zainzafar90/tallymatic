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
        validate: {
          min: 8,
          max: 128,
          is: /^(?=.*[a-zA-Z])(?=.*[0-9])/, // Password must contain at least one letter and one number
        },
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      roles: {
        type: Sequelize.ARRAY(Sequelize.ENUM('user', 'admin')),
        allowNull: false,
        defaultValue: ['user'],
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
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
