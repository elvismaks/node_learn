const express = require('express')
const router = express.Router()
const {
    User,sequelize
} = require('../../models')

const {
    Op
} = require('sequelize')

const {
    NotFoundError
} = require('../../utils/errors');
const {
    success,
    failure
} = require('../../utils/responses');


//查詢全部文章
router.get('/sex', async function (req, res) {
    try {
        const male = await User.count({
            where: {
                sex: 0
            }
        });
        const female = await User.count({
            where: {
                sex: 1
            }
        });
        const unknown = await User.count({
            where: {
                sex: 2
            }
        });

        const data = [{
                value: male,
                name: '男性'
            },
            {
                value: female,
                name: '女性'
            },
            {
                value: unknown,
                name: '未選擇'
            }
        ];

        success(res, '查詢用戶性別成功。', {
            data
        });

    } catch (error) {
        failure(res, error)
    }

})

router.get('/user', async function (req, res) {
    try {
        const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC");
        const data = {
            months: [],
            values: [],
        };

        results.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });

        success(res, '查詢每月用戶數量成功。', {
            data
        });

    } catch (error) {
        failure(res, error)
    }

})

module.exports = router;