const {  User,asyncHandler,ApiError} = require('../user.dependencies');


/**
 * @desc    Update statusMessage profile
 * @route   PUT /api/v1/user/edit/name
 * @access  Private
 */
const editName = asyncHandler(async (req, res) => {
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
            massage : "Name updated successfully"
        });
    }
});
module.exports = editName ;