const User = require('../../../user/model/user.model');
const asyncHandler = require('express-async-handler')
const ApiError = require('../../../../util/APIError');


/**
 * @desc    Get user profile
 * @route   GET /api/v1/user/profile
 * @access  Private
 */
const getprofile = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id).select('-password -createdAt -updatedAt -__v -_id -role');
    if (!user) {
        return next(new ApiError(`No User found for ID: ${id}`, 404));
    }
    if (user.isBlocked) {
        return next(new ApiError('You are blocked', 403));
    } else {
        res.status(200).json({
            data: user
        });
    }
});

module.exports = getprofile;