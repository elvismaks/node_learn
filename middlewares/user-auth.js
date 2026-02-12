const jwt = require('jsonwebtoken');
const {
    User
} = require('../models');
const {
    UnauthorizedError
} = require('../utils/errors');
const {
    success,
    failure
} = require('../utils/responses');

module.exports = async (req, res, next) => {
    try {
        // 判斷 Token 是否存在
        const {
            token
        } = req.headers; //一般token存放在header中
        if (!token) {
            throw new UnauthorizedError('當前接口需要認證才能訪問。')
        }

        // 驗證 token 是否正確
        const decoded = jwt.verify(token, process.env.SECRET);

        //console.log(decoded)
        // 從 jwt 中，解析出之前存入的 userId
        const {
            userId
        } = decoded;

        console.log(userId)
        // 如果通過驗證，將 userId 對像掛載到 req 上，方便後續中間件或路由使用
        req.userId = userId;

        // 一定要加 next()，才能繼續進入到後續中間件或路由
        next();




    } catch (error) {
        failure(res, error);
    }
};