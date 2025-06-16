const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new AppError("You're not authorized!", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return next(new AppError("Invalid or expired token!", 401));
    }
};

module.exports = verifyToken;
