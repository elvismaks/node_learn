const express = require('express')
const router = express.Router()
const {
    Article
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
router.get('/', async function (req, res) {
    try {
        //return res.json(req.user.username) //以接數中間件傳來的user全部資訊息
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

        //const articles = await Article.findAll(condition);
        const {
            count,
            rows
        } = await Article.findAndCountAll(condition)
        success(res, '查詢文章列表成功', {
            articles: rows,
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

//查找單個文章
router.get('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        // const article = await Article.findByPk(id)
        const article = await getArticle(req)
        success(res, '查询文章成功', {
            article
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "查詢失敗",
            error: [error.message]
        })
    }
})

//創建文章
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req)
        const article = await Article.create(body)
        success(res, '創建文章成功。', {
            article
        }, 201);
    } catch (error) {
        failure(res, error)
    }

})

//刪除文章
router.delete('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const article = await getArticle(req)
        //const article = await Article.findByPk(id)

        await article.destroy()
        success(res, '删除文章成功。');

    } catch (error) {
        failure(res, error)
    }
})

//更改文章
router.put('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const article = await getArticle(req)
        //const article = await Article.findByPk(id)
        //白名單過濾
        const body = filterBody(req)

        await article.update(body)

        success(res, '更新文章成功。', {
            article
        });
    } catch (error) {
        failure(res, error)
    }
})

async function getArticle(req) {
    // 獲取文章 ID
    const {
        id
    } = req.params;

    // 查詢當前文章
    const article = await Article.findByPk(id);

    // 如果沒有找到，就拋出異常
    if (!article) {
        throw new NotFoundError(`ID: ${ id }的文章未找到。`)
    }

    return article;
}


function filterBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}
module.exports = router;