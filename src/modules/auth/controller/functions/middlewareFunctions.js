const User = require('../../../user/model/user.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const ApiError = require('../../../../util/APIError');

/**
 * @desc    Middleware to check if user is verified
 * @route   POST /api/v1/auth/check-verification
 * @access  Public
 */
const checkVerification = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.isVerified) {
        return next(new ApiError('User not verified', 401));
    }
    next();
});


/**
 * @desc    Middleware to protect routes
 * @route   GET /api/v1/auth/protected
 * @access  Private
 */
const ProtectedRoters = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError("You are not logged in", 401));
    }
    // 2- Verify token (no chanage happens , expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 3- check if user is Exist or Not
    const user = await User.findById(decoded.userId);
    if (!user) {
        return next(new ApiError('User no longer exists', 401));
    }
    // 4- check if user chanage is password after token created
    if (user.passwordChanagedAt) {
        const passChanagedTimestamp = parseInt(user.passwordChanagedAt.getTime() / 1000, 10);
        // if password chanaged after token created then return error
        if (passChanagedTimestamp > decoded.iat) {
            return next(new ApiError('Your password has been changed, please login again', 401));
        }
    }
    req.user = user;
    next();
});

/**
 * 
 * @desc    Middleware to check user role
 * @route   GET /api/v1/auth/check-role
 * @access  Private
 * @param  {...string} roles 
 * @returns {Function} next()
 * @throws {ApiError} 403 - Forbidden
 */
const allwedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!(roles.includes(req.user.role))) {
        return next(new ApiError('You are not authorized to access this route', 403));
    }
    next();
});

module.exports = {
    checkVerification,
    ProtectedRoters,
    allwedTo 
}