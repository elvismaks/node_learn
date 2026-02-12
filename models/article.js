'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false, //是否可為空
      validate: {
        //出錯時提示訊息
        notNull: {
          msg: '標題必須存在。'
        },
        notEmpty: {
          msg: '標題不能為空。'
        },
        len: {
          args: [2, 45],
          msg: '標題長度需要在2 ~ 45個字符之間。'
        }
      }
    }, 
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};