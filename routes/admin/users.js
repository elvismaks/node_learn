const express = require('express')
const router = express.Router()
const {
    User
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


//查詢全部用戶
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

        if (query.email) {
            condition.where = {
                email: {
                    [Op.eq]: query.email
                }
            };
        }

        if (query.username) {
            condition.where = {
                username: {
                    [Op.eq]: query.username
                }
            };
        }

        if (query.nickname) {
            condition.where = {
                nickname: {
                    [Op.like]: `%${ query.nickname }%`
                }
            };
        }

        if (query.role) {
            condition.where = {
                role: {
                    [Op.eq]: query.role
                }
            };
        }

        //const users = await User.findAll(condition);
        const {
            count,
            rows
        } = await User.findAndCountAll(condition)
        success(res, '查詢用戶列表成功', {
            users: rows,
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

//查找單個用戶
router.get('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        // const user = await User.findByPk(id)
        const user = await getUser(req)
        success(res, '查询用戶成功', {
            user
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "查詢失敗",
            error: [error.message]
        })
    }
})

//創建用戶
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req)
        const user = await User.create(body)
        success(res, '創建用戶成功。', {
            user
        }, 201);
    } catch (error) {
        failure(res, error)
    }

})

//刪除用戶
router.delete('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const user = await getUser(req)
        //const user = await User.findByPk(id)

        await user.destroy()
        success(res, '删除用戶成功。');

    } catch (error) {
        failure(res, error)
    }
})

//更改用戶
router.put('/:id', async function (req, res) {
    try {
        // const {
        //     id
        // } = req.params
        const user = await getUser(req)
        //const user = await User.findByPk(id)
        //白名單過濾
        const body = filterBody(req)

        await user.update(body)

        success(res, '更新用戶成功。', {
            user
        });
    } catch (error) {
        failure(res, error)
    }
})

async function getUser(req) {
    // 獲取用戶 ID
    const {
        id
    } = req.params;

    // 查詢當前用戶
    const user = await User.findByPk(id);

    // 如果沒有找到，就拋出異常
    if (!user) {
        throw new NotFoundError(`ID: ${ id }的用戶未找到。`)
    }

    return user;
}


function filterBody(req) {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
    }
}
module.exports = router;