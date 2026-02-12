/**
 * 自定義 400 錯誤類
 */
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
    }
}

/**
 * 自定義 401 錯誤類
 */
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

/**
 * 自定義 404 錯誤類
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
}