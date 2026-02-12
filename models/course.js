'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment')
moment.locale('zh-cn')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Course.belongsTo(models.Category, {
        as: 'category'
      });
      models.Course.belongsTo(models.User, {
        as: 'user'
      });
      models.Course.hasMany(models.Chapter, {
        as: 'chapters'
      });

      models.Course.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'courseId',
        as: 'likeUsers'
      });

    }

  }


  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分類ID必須填寫。'
        },
        notEmpty: {
          msg: '分類ID不能為空。'
        },
        async isPresent(value) {
          const category = await sequelize.models.Category.findByPk(value)
          if (!category) {
            throw new Error(`ID為：${value} 的分類不存在。`);
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用戶ID必須填寫。'
        },
        notEmpty: {
          msg: '用戶ID不能為空。'
        },
        async isPresent(value) {
          const user = await sequelize.models.User.findByPk(value)
          if (!user) {
            throw new Error(`ID為：${value} 的用戶不存在。`);
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '名稱必須填寫。'
        },
        notEmpty: {
          msg: '名稱不能為空。'
        },
        len: {
          args: [2, 45],
          msg: '名稱長度必須是2 ~ 45之間。'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: '圖片地址不正確。'
        }
      }
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: {
          args: [
            [true, false]
          ],
          msg: '是否推薦的值必須是，推薦：true 不推薦：false。'
        }
      }
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: {
          args: [
            [true, false]
          ],
          msg: '是否入門課程的值必須是，推薦：true 不推薦：false。'
        }
      }
    },
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER,

    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY年MM月DD日 HH:mm:ss");
      }
    },


  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};