const {ApiError,User,Friend,getIO,activeUsers,asyncHandler} = require('../friends.dependencies');

/**
 * @desc    Unblock a user
 * @route   POST /api/@:handle/unblock
 * @access  Private
 */
const unblockUser = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const targetHandle = '@' + req.params.handle;

    const targetUser = await User.findOne({ handle: targetHandle });
    if (!targetUser) {
        return next(new ApiError('User not found with this handle', 404));
    }

    if (userId === targetUser._id.toString()) {
        return next(new ApiError('You cannot unblock yourself', 400));
    }

    const user = await User.findById(userId);

    if (!user.blockedUsers.includes(targetUser._id)) {
        return next(new ApiError('This user is not in your blocked list', 400));
    }

    user.blockedUsers = user.blockedUsers.filter(
        (id) => id.toString() !== targetUser._id.toString()
    );

    await user.save();

    const targetSocketId = activeUsers.getSocketId(targetUser._id.toString());
    if (targetSocketId) {
        getIO().to(targetSocketId).emit('unblocked_by_user', {
            by: {
                id: user._id,
                name: user.name,
                handle: user.handle
            },
            message: `${user.name} has unblocked you.`
        });
    }

    res.status(200).json({
        message: `You have unblocked ${targetUser.name}`,
    });
});

module.exports = unblockUser;