
const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const APPError = require('../utils/appError');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader)
    {
        const error = APPError.createError( 401 ,'Access denied, please re-authenticate', httpStatusText.FAIL);
        return next(error);
    }
   const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        const error = APPError.createError( 401 ,'Access denied, please re-authenticate', httpStatusText.FAIL);
        return next(error);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const error = APPError.createError( 403 ,'Invalid token', httpStatusText.FAIL);
            return next(error);
        }
        req.user = user;
        next();
    });
}

module.exports = {verifyToken};