'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Course, {
        as: 'courses'
      });

      models.User.belongsToMany(models.Course, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'likeCourses'
      });

    }

  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '郵箱必須填寫。'
        },
        notEmpty: {
          msg: '郵箱不能為空。'
        },
        isEmail: {
          msg: '郵箱格式不正確。'
        },
        async isUnique(value) {
          const user = await User.findOne({
            where: {
              email: value
            }
          })
          if (user) {
            throw new Error('郵箱已存在，請直接登錄。');
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用戶名必須填寫。'
        },
        notEmpty: {
          msg: '用戶名不能為空。'
        },
        len: {
          args: [2, 45],
          msg: '用戶名長度必須是2 ~ 45之間。'
        },
        async isUnique(value) {
          const user = await User.findOne({
            where: {
              username: value
            }
          })
          if (user) {
            throw new Error('用戶名已經存在。');
          }
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '密碼必須填寫。'
        },
        notEmpty: {
          msg: '密碼不能為空。'
        },
        // len: {
        //   args: [6, 45],
        //   msg: '密碼長度必須是6 ~ 45之間。'
        // }
        set(value) {
          // 檢查是否為空
          if (!value) {
            throw new Error('密碼必須填寫。');
          }
          // 檢查長度
          if (value.length < 6 || value.length > 45) {
            throw new Error('密碼長度必須是6 ~ 45之間。');
          }
          // 如果通過所有驗證，進行hash處理並設置值
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '昵稱必須填寫。'
        },
        notEmpty: {
          msg: '昵稱不能為空。'
        },
        len: {
          args: [2, 45],
          msg: '昵稱長度必須是2 ~ 45之間。'
        }
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '性別必須填寫。'
        },
        notEmpty: {
          msg: '性別不能為空。'
        },
        isIn: {
          args: [
            [0, 1, 2]
          ],
          msg: '性別的值必須是，男性：0 女性：1 未選擇：2。'
        }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用戶組必須選擇。'
        },
        notEmpty: {
          msg: '用戶組不能為空。'
        },
        isIn: {
          args: [
            [0, 100]
          ],
          msg: '用戶組的值必須是，普通用戶：0 管理員：100。'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: '圖片地址不正確。'
        }
      }
    },

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};