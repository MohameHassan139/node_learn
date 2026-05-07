
const httpStatusText = require('../utils/httpStatusText');
const APPError = require('../utils/appError');

const allowedTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            const error = APPError.createError( 403 ,'You are not allowed to perform this action', httpStatusText.FAIL);
            return next(error);
        }
        next();
    };
};

module.exports = { allowedTo };