'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = [];
    const counts = 100;

    for (let i = 1; i <= counts; i++) {
      const article = {
        title: `文章的標提 ${i}`,
        content: `文章的內容 ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      articles.push(article);
    }

    await queryInterface.bulkInsert('Articles', articles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};