const express = require('express');
const router = express.Router();
const {
    User
} = require('../../models');
const {
    Op
} = require('sequelize');
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} = require('../../utils/errors');
const {
    success,
    failure
} = require('../../utils/responses');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const crypto = require('crypto')

/**
 * 管理員登錄
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
    try {
        //console.log(crypto.randomBytes(32).toString('hex'))
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
        const isPasswordValid = bcrypt.compareSync(password, user.password); //user.password為數據庫加密密碼
        if (!isPasswordValid) {
            throw new UnauthorizedError('密碼錯誤')
        }

        // 驗證是否管理員
        if (user.role !== 100) {
            throw new UnauthorizedError('您沒有權限登錄管理員後台。');
        }

        // 生成身份驗證令牌
        const token = jwt.sign({
            userId: user.id //可加用戶名..
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