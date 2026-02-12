'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Category.hasMany(models.Course, {
        as: 'courses'
      });
    }

  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: '名稱已存在，請選擇其他名稱。'
      },
      validate: {
        notNull: {
          msg: '名稱必須填寫。'
        },
        notEmpty: {
          msg: '名稱不能為空。'
        },
        len: {
          args: [2, 45],
          msg: '長度必須是2 ~ 45之間。'
        },
        async isUnique(value) {
          const category = await Category.findOne({
            where: {
              name: value
            }
          })
          if (category) {
            throw new Error('名稱已存在，請選擇其他名稱。');
          }
        }

      }
    },

    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '排序必須填寫。'
        },
        notEmpty: {
          msg: '排序不能為空。'
        },
        isInt: {
          msg: '排序必須為整數。'
        },
        // isPositive(value) {
        //   if (value <= 0) {
        //     throw new Error('排序必須是正整數。');
        //   }
        // },
        min: {
          args: [1],
          msg: '排序必須大於等於 1'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};