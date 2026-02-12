'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Chapters', [{
        courseId: 1,
        title: 'CSS 課程介紹',
        content: 'CSS的全名是層疊樣式表。官方的解釋，我就不細說了，因為就算細說了，對新手朋友們來說，聽得還是一臉懵逼。那我們就用最通俗的說法來講，到底啥是CSS？',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2,
        title: 'Node.js 課程介紹',
        content: '這套課程，定位是使用 JS 來全棧開發項目。讓我們一起從零基礎開始，學習接口開發。先從最基礎的項目搭建、數據庫的入門，再到完整的真實項目開發，一步步的和大家一起完成一個真實的項目。',
        video: '',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2,
        title: '安裝 Node.js',
        content: '安裝Node.js，最簡單辦法，就是直接在官網下載了安裝。但這種方法，卻不是最好的辦法。因為如果需要更新Node.js的版本，那就需要把之前的卸載了，再去下載安裝其他版本，這樣就非常的麻煩了。',
        video: '',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Chapters', null, {});
  }

};