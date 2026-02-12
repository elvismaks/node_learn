const express = require('express')
const router = express.Router()
const {
    Chapter, Course
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


//查詢全部章節
router.get('/', async function (req, res) {
    try {
        const query = req.query
        // 當前是第幾頁，如果不傳，那就是第一頁
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        // 每頁顯示多少條數據，如果不傳，那就顯示10條
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        // 計算 offset
        const offset = (currentPage - 1) * pageSize;
        
        if (!query.courseId) {
            throw new Error('獲取章節列表失敗，課程ID不能為空。');
        }
        const condition = {
            ...getCondition(),
            order: [
                ['rank', 'ASC'],
                ['id', 'ASC']
            ],
            limit: pageSize,
            offset: offset
        };

        condition.where = {
            courseId: {
                [Op.eq]: query.courseId
            }
        };

        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${ query.title }%`
                }
            };
        }
        //const chapters = await Chapter.findAll(condition);
        const {
            count,
            rows
        } = await Chapter.findAndCountAll(condition)
        success(res, '查詢章節列表成功', {
            chapters: rows,
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

//查找單個章節
router.get('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        // const chapter = await Chapter.findByPk(id)
        const chapter = await getChapter(req)
        success(res, '查詢章節成功', {
            chapter
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "查詢失敗",
            error: [error.message]
        })
    }
})

//創建章節
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req)
        const chapter = await Chapter.create(body)
        success(res, '創建章節成功。', {
            chapter
        }, 201);
    } catch (error) {
        failure(res, error)
    }

})

//刪除章節
router.delete('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const chapter = await getChapter(req)
        //const chapter = await Chapter.findByPk(id)

        await chapter.destroy()
        success(res, '刪除章節成功。');

    } catch (error) {
        failure(res, error)
    }
})

//更改章節
router.put('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const chapter = await getChapter(req)
        //const chapter = await Chapter.findByPk(id)
        //白名單過濾
        const body = filterBody(req)

        await chapter.update(body)

        success(res, '更新章節成功。', {
            chapter
        });
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 公共方法：關聯課程數據
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        attributes: {
            exclude: ['CourseId']
        },
        include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'name']
        }]
    }
}

async function getChapter(req) {
    // 獲取章節 ID
    const {
        id
    } = req.params;
    const condition = getCondition();
    // 查詢當前章節
    const chapter = await Chapter.findByPk(id, condition);

    // 如果沒有找到，就拋出異常
    if (!chapter) {
        throw new NotFoundError(`ID: ${ id }的章節未找到。`)
    }

    return chapter;
}


function filterBody(req) {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank
    }
}
module.exports = router;