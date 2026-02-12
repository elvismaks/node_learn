'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment')
moment.locale('zh-cn')
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Chapter.belongsTo(models.Course, {
        as: 'course'
      });
    }

  }
  Chapter.init({
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '課程ID必須填寫。'
        },
        notEmpty: {
          msg: '課程ID不能為空。'
        },
        async isPresent(value) {
          const course = await sequelize.models.Course.findByPk(value)
          if (!course) {
            throw new Error(`ID為：${ value } 的課程不存在。`);
          }
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '標題必須填寫。'
        },
        notEmpty: {
          msg: '標題不能為空。'
        },
        len: {
          args: [2, 45],
          msg: '標題長度必須是2 ~ 45之間。'
        }
      }
    },
    content: DataTypes.TEXT,
    video: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: '視頻地址不正確。'
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
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必須是正整數。');
          }
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY-MM-DD HH:mm:ss");
        //return moment(this.getDataValue("updatedAt")).format("YYYY年MM月DD日 HH:mm:ss");
      }
    },

  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};