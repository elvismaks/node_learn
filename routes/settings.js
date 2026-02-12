const express = require('express');
const router = express.Router();
const {
    Setting
} = require('../models');
const {
    NotFoundError
} = require('../utils/errors');
const {
    success,
    failure
} = require('../utils/responses');

/**
 * 查詢系統信息
 * GET /settings
 */
router.get('/', async function (req, res) {
    try {
        const setting = await Setting.findOne();
        if (!setting) {
            throw new NotFoundError('未找到系統設置，請聯繫管理員。')
        }

        success(res, '查詢系統信息成功。', {
            setting
        });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
