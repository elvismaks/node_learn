const express = require('express');
const router = express.Router();
const {
  User
} = require('../models');
const {
  success,
  failure
} = require('../utils/responses');
const {
  BadRequestError,
  NotFoundError
} = require("../utils/errors");
const bcrypt = require('bcryptjs');

/**
 * 查詢當前登錄用戶詳情
 * GET /users/me
 */
router.get('/me', async function (req, res) {
  try {
    const user = await getUser(req);
    success(res, '查詢當前用戶信息成功。', {
      user
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查詢當前用戶
 * @param req
 * @param showPassword
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getUser(req, showPassword = false) {
  const id = req.userId;

  let condition = {};
  if (!showPassword) {
    condition = {
      attributes: {
        exclude: ['password']
      },
    };
  }

  const user = await User.findByPk(id, condition);
  if (!user) {
    throw new NotFoundError(`ID: ${ id }的用戶未找到。`)
  }

  return user;
}

/**
 * 更新用戶信息
 * PUT /users/info
 */
router.put('/info', async function (req, res) {
  try {
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar
    };

    const user = await getUser(req);
    await user.update(body);
    success(res, '更新用戶信息成功。', {
      user
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新賬戶信息
 * PUT /users/account
 */
router.put('/account', async function (req, res) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      currentPassword: req.body.currentPassword,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    if (!body.currentPassword) {
      throw new BadRequestError('當前密碼必須填寫。');
    }

    if (body.password !== body.passwordConfirmation) {
      throw new BadRequestError('兩次輸入的密碼不一致。');
    }

    // 加上 true 參數，可以查詢到加密後的密碼
    const user = await getUser(req, true);

    // 驗證當前密碼是否正確
    const isPasswordValid = bcrypt.compareSync(body.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('當前密碼不正確。');
    }

    await user.update(body);

    // 刪除密碼
    delete user.dataValues.password;
    success(res, '更新賬戶信息成功。', {
      user
    });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;