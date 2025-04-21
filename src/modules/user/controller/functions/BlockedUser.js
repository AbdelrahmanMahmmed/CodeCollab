const {  User,asyncHandler,ApiError} = require('../user.dependencies');

/**
 * @desc    Block user
 * @route   PUT /api/v1/user/block
 * @access  Private
 */
const Blocked = asyncHandler(async (req, res) => {
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

module.exports = Blocked;