const express = require('express')
const router = express.Router()
const {
    Course,
    Category,
    User,
    Chapter
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


//查詢全部課程
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
            ...getCondition(),
            order: [
                ['id', 'desc'],

            ],
            limit: pageSize,
            offset: offset
        };

        if (query.categoryId) {
            condition.where = {
                categoryId: {
                    [Op.eq]: query.categoryId
                }
            };
        }

        if (query.userId) {
            condition.where = {
                userId: {
                    [Op.eq]: query.userId
                }
            };
        }

        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${ query.name }%`
                }
            };
        }

        if (query.recommended) {
            condition.where = {
                recommended: {
                    // 需要轉布爾值
                    [Op.eq]: query.recommended === 'true'
                }
            };
        }

        if (query.introductory) {
            condition.where = {
                introductory: {
                    [Op.eq]: query.introductory === 'true'
                }
            };
        }


        //const courses = await Course.findAll(condition);
        const {
            count,
            rows
        } = await Course.findAndCountAll(condition)
        success(res, '查詢課程列表成功', {
            courses: rows,
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

//查找單個課程
router.get('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        // const course = await Course.findByPk(id)
        const course = await getCourse(req)
        success(res, '查詢課程成功', {
            course
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "查詢失敗",
            error: [error.message]
        })
    }
})

//創建課程
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req)
        body.userId=req.user.id
        const course = await Course.create(body)
        success(res, '創建課程成功。', {
            course
        }, 201);
    } catch (error) {
        failure(res, error)
    }

})

//刪除課程
router.delete('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const course = await getCourse(req)
        //const course = await Course.findByPk(id)

        const count = await Chapter.count({
            where: {
                courseId: req.params.id
            }
        });
        if (count > 0) {
            throw new Error('當前課程有章節，無法刪除。');
        }

        await course.destroy()
        success(res, '刪除課程成功。');

    } catch (error) {
        failure(res, error)
    }
})

//更改課程
router.put('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const course = await getCourse(req)
        //const course = await Course.findByPk(id)
        //白名單過濾
        const body = filterBody(req)

        await course.update(body)

        success(res, '更新課程成功。', {
            course
        });
    } catch (error) {
        failure(res, error)
    }
})

function getCondition() {
    return {
        attributes: {
            exclude: ['CategoryId', 'UserId']
        },
        include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ]
    }
}

async function getCourse(req) {
    // 獲取課程 ID
    const {
        id
    } = req.params;

    const condition = getCondition()
    // 查詢當前課程
    const course = await Course.findByPk(id, condition);

    // 如果沒有找到，就拋出異常
    if (!course) {
        throw new NotFoundError(`ID: ${ id }的課程未找到。`)
    }

    return course;
}


function filterBody(req) {
    return {
        categoryId: req.body.categoryId,
        //userId: req.body.userId, //userId應由登入決定，不應由表單傳入
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content
    }
}
module.exports = router;