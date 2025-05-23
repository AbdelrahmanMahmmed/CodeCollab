const {  User,asyncHandler,ApiError} = require('../user.dependencies');

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/user/edit/status
 * @access  Private
 */
const editStatus = asyncHandler(async (req, res) => {
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
            massage : "Status updated successfully"
        });
    }
});
module.exports = editStatus ;