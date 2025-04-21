const {  User,asyncHandler,ApiError} = require('../user.dependencies');

/**
 * @desc    UnBlock user
 * @route   PUT /api/v1/user/unblock
 * @access  Private
 */
const UnBlocked = asyncHandler(async (req, res) => {
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

module.exports = UnBlocked ;
