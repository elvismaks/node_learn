const express = require('express')
const router = express.Router()
const {
    Setting
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


//查詢全部系統設置
router.get('/', async function (req, res) {
    try {
        const query = req.query
        // 當前是第幾頁，如果不傳，那就是第一頁
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        // 每頁顯示多少條數據，如果不傳，那就顯示10條
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        // 計算 offset
        const offset = (currentPage - 1) * pageSize;
        const condition = {
            order: [
                ['id', 'desc'],

            ],
            limit: pageSize,
            offset: offset
        };

        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }

        //const settings = await Setting.findAll(condition);
        const {
            count,
            rows
        } = await Setting.findAndCountAll(condition)
        success(res, '查詢系統設置列表成功', {
            settings: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        })
    } catch (error) {
        failure(res, error)
    }

})

//查找單個系統設置
router.get('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        // const setting = await Setting.findByPk(id)
        const setting = await getSetting()
        success(res, '查询系統設置成功', {
            setting
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "查詢失敗",
            error: [error.message]
        })
    }
})

//創建系統設置
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req)
        const setting = await Setting.create(body)
        success(res, '創建系統設置成功。', {
            setting
        }, 201);
    } catch (error) {
        failure(res, error)
    }

})

//刪除系統設置
router.delete('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const setting = await getSetting()
        //const setting = await Setting.findByPk(id)

        await setting.destroy()
        success(res, '删除系統設置成功。');

    } catch (error) {
        failure(res, error)
    }
})

//更改系統設置
router.put('/', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const setting = await getSetting()
        //const setting = await Setting.findByPk(id)
        //白名單過濾
        const body = filterBody(req)

        await setting.update(body)

        success(res, '更新系統設置成功。', {
            setting
        });
    } catch (error) {
        failure(res, error)
    }
})

async function getSetting() {
    const setting = await Setting.findOne();
    if (!setting) {
        throw new NotFoundError('初始系統設置未找到，請運行種子文件。')
    }
    return setting;
}


function filterBody(req) {
    return {
        name: req.body.name,
        icp: req.body.icp,
        copyright: req.body.copyright
    }
}
module.exports = router;