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
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../utils/errors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    Op
} = require("sequelize");

/**
 * 用戶註冊
 * POST /auth/sign_up
 */
router.post('/sign_up', async function (req, res) {
    try {
        const body = {
            email: req.body.email,
            username: req.body.username,
            nickname: req.body.nickname,
            password: req.body.password,
            sex: 2,
            role: 0
        }

        const user = await User.create(body);

        delete user.dataValues.password //刪除密碼使密碼不返回用戶
        success(res, '創建用戶成功。', {
            user
        }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 用戶登錄
 * POST /auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
    try {
        const {
            login,
            password
        } = req.body;

        if (!login) {
            throw new BadRequestError('郵箱/用戶名必須填寫。');
        }

        if (!password) {
            throw new BadRequestError('密碼必須填寫。');
        }

        const condition = {
            where: {
                [Op.or]: [{
                        email: login
                    },
                    {
                        username: login
                    }
                ]
            }
        };

        // 通過email或username，查詢用戶是否存在
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFoundError('用戶不存在，無法登錄。');
        }

        // 驗證密碼
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('密碼錯誤。');
        }

        // 生成身份驗證令牌
        const token = jwt.sign({
            userId: user.id
        }, process.env.SECRET, {
            expiresIn: '30d'
        });
        success(res, '登錄成功。', {
            token
        });
    } catch (error) {
        failure(res, error);
    }
});




module.exports = router;