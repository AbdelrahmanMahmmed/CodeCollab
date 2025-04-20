const User = require('../model/user.model');
const asyncHandler = require('express-async-handler')
const ApiError = require('../../../util/APIError');

/**
 * @desc    Get user profile
 * @route   GET /api/v1/user/profile
 * @access  Private
 */
exports.profile = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/user/edit/status
 * @access  Private
 */
exports.editStatus = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        statusMessage: req.body.status,
    }, { new: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.isBlocked) {
        return res.status(403).json({ message: 'You are blocked' });
    } else {
        res.status(200).json({
            data: user
        });
    }
});

/**
 * @desc    Update statusMessage profile
 * @route   PUT /api/v1/user/edit/name
 * @access  Private
 */
exports.editName = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
    }, { new: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
        return res.status(403).json({ message: 'You are blocked' });
    } else {
        res.status(200).json({
            data: user
        });
    }
});

/**
 * @desc    Block user
 * @route   PUT /api/v1/user/block
 * @access  Private
 */
exports.Blocked = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        isBlocked: true,
    }, { new: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        message: 'User is Blocked successfully',
    });
});

/**
 * @desc    UnBlock user
 * @route   PUT /api/v1/user/unblock
 * @access  Private
 */
exports.UnBlocked = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        isBlocked: false,
    }, { new: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        message: 'User is UnBlocked successfully',
    });
});

/**
 * @desc    Get user by handle
 * @route   GET /:handle
 * @access  Public
 */
exports.getUserByHandle = asyncHandler(async (req, res) => {
    const handleParam = '@' + req.params.handle;
    const user = await User.findOne({ handle: handleParam }).select('-_id name avatar handle statusMessage');
    if (!user) {
        return res.status(404).json({ message: 'Handle is Wrong' });
    }
    res.status(200).json({ user });
});