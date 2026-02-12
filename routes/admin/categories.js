const express = require('express')
const router = express.Router()
const {
    Category
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


//查詢全部分類
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
                ['rank', 'ASC'],
                ['id', 'desc'],

            ],
            limit: pageSize,
            offset: offset
        };

        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }

        //const categories = await Category.findAll(condition);
        const {
            count,
            rows
        } = await Category.findAndCountAll(condition)
        success(res, '查詢分類列表成功', {
            categories: rows,
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

//查找單個分類
router.get('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        // const category = await Category.findByPk(id)
        const category = await getCategory(req)
        success(res, '查詢分類成功', {
            category
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "查詢失敗",
            error: [error.message]
        })
    }
})

//創建分類
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req)
        const category = await Category.create(body)
        success(res, '創建分類成功。', {
            category
        }, 201);
    } catch (error) {
        failure(res, error)
    }

})

//刪除分類
router.delete('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const category = await getCategory(req)

        //查詢分類中是否還有科程存在
        const count = await Course.count({
            where: {
                categoryId: req.params.id
            }
        });
        if (count > 0) {
            throw new Error('當前分類有課程，無法刪除。');
        }
        //const category = await Category.findByPk(id)

        await category.destroy()
        success(res, '刪除分類成功。');

    } catch (error) {
        failure(res, error)
    }
})

//更改分類
router.put('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const category = await getCategory(req)
        //const category = await Category.findByPk(id)
        //白名單過濾
        const body = filterBody(req)

        await category.update(body)

        success(res, '更新分類成功。', {
            category
        });
    } catch (error) {
        failure(res, error)
    }
})

async function getCategory(req) {
    // 獲取分類 ID
    const {
        id
    } = req.params;

    // 查詢當前分類
    const category = await Category.findByPk(id);

    // 如果沒有找到，就拋出異常
    if (!category) {
        throw new NotFoundError(`ID: ${ id }的分類未找到。`)
    }

    return category;
}


function filterBody(req) {
    return {
        name: req.body.name,
        rank: req.body.rank
    }
}
module.exports = router;