const express = require('express');
const router = express.Router();
const {
    Course,
    Like,
    User
} = require('../models');
const {
    success,
    failure
} = require('../utils/responses');
const {
    NotFoundError
} = require('../utils/errors');

/**
 * 點贊、取消贊
 * POST /likes
 */
router.post('/', async function (req, res) {
    try {
        const userId = req.userId; //還是從 req 裡來，誰登錄了，就是誰
        const {
            courseId //是前端通過 POST 發過來的數據了。
        } = req.body;

        const course = await Course.findByPk(courseId);
        if (!course) {
            throw new NotFoundError('課程不存在。');
        }

        // 檢查課程之前是否已經點贊
        const like = await Like.findOne({
            where: {
                courseId,
                userId
            }
        });

        // 如果沒有點贊過，那就新增。並且課程的 likesCount + 1
        if (!like) {
            await Like.create({
                courseId,
                userId
            });
            await course.increment('likesCount');
            success(res, '點贊成功。')
        } else {
            // 如果點贊過了，那就刪除。並且課程的 likesCount - 1
            await like.destroy();
            await course.decrement('likesCount');
            success(res, '取消贊成功。')
        }

        /**
         * 查詢用戶點讚的課程
         * GET /likes
         */


    } catch (error) {
        failure(res, error);
    }
});

router.get('/', async function (req, res) {
    try {

        // // 通過課程查詢點讚的用戶
        // const course = await Course.findByPk(1, {
        //     include: {
        //         model: User,
        //         as: 'likeUsers'
        //     }
        // });
        // success(res, '查詢當前課程點讚的用戶成功。', course)

        // 通過用戶查詢點讚的課程
        // const user = await User.findByPk(req.userId, {
        //     include: {
        //         model: Course,
        //         as: 'likeCourses'
        //     }

        //     //因為用戶點讚的課程有可能非常多，所以要加上分頁的參數。 
        //     // 但是在多對多關聯的 include 裡，沒法用 limit 這些參數，
        //     // 加上就報錯
        // });
        // success(res, '查詢當前用戶點讚的課程成功。', user)

        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;

        // 查詢當前用戶
        const user = await User.findByPk(req.userId);
        // 查詢當前用戶點贊過的課程
        const courses = await user.getLikeCourses({
            joinTableAttributes: [], //查詢關聯表的屬性是空，也就是關聯表什麼都不查
            attributes: {
                exclude: ['CategoryId', 'UserId', 'content']
            },
            order: [
                ['id', 'DESC']
            ],
            limit: pageSize,
            offset: offset
        });

        // 查詢當前用戶點贊過的課程總數
        const count = await user.countLikeCourses();

        success(res, '查詢用戶點讚的課程成功。', {
            courses,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }
        });


    } catch (error) {
        failure(res, error);
    }
});
module.exports = router;