/**
 * 自定義 404 錯誤類
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

/**
 *請求成功
 *@param res 
 *@param message
 *@param data
 *@param code
 */

function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    });
}

/**
 * 請求失敗
 * @param res
 * @param error
 */
function failure(res, error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        return res.status(400).json({
            status: false,
            message: '請求參數錯誤',
            errors
        });
    }

    if (error.name === 'BadRequestError') {
        return res.status(400).json({
            status: false,
            message: '請求參數錯誤',
            errors: [error.message]
        });
    }

    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: false,
            message: '認證失敗',
            errors: [error.message]
        });
    }

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            message: '認證失敗',
            errors: ['您提交的 token 錯誤。']
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            message: '認證失敗',
            errors: ['您的 token 已過期。']
        });
    }

    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            status: false,
            message: '資源不存在',
            errors: [error.message]
        });
    }

    res.status(500).json({
        status: false,
        message: '服務器錯誤',
        errors: [error.message]
    });
}

module.exports = {
    success,
    failure
}