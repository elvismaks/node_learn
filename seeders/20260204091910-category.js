'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [{
        name: '前端開發',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '後端開發',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '移動端開發',
        rank: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '數據庫',
        rank: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '服務器運維',
        rank: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '公共',
        rank: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};