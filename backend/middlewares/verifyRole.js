const AppError = require("../utils/appError");

const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new AppError('You do not have permission to perform this action', 403);
            return next(error);
        }
        next();
    };
};

module.exports = verifyRole;