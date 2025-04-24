const {ApiError,User,Friend,getIO,activeUsers,asyncHandler} = require('../friends.dependencies');

/**
 * @desc    Unfriend a user
 * @route   DELETE /api/friends/requests/unfriend/@:handle
 * @access  Private
 */
const unfriendUser = asyncHandler(async (req, res, next) => {
    const currentUserId = req.user.id;
    const targetHandle = '@' + req.params.handle;

    const targetUser = await User.findOne({ handle: targetHandle });
    if (!targetUser) {
        return next(new ApiError('User not found with this handle', 404));
    }

    const deleted = await Friend.findOneAndDelete({
        $or: [
            { requester: currentUserId, recipient: targetUser._id, status: 'Accepted' },
            { requester: targetUser._id, recipient: currentUserId, status: 'Accepted' },
        ],
    });

    if (!deleted) {
        return next(new ApiError('You are not friends with this user', 400));
    }

    await User.findByIdAndUpdate(currentUserId, {
        $pull: { friends: targetUser._id }
    });

    await User.findByIdAndUpdate(targetUser._id, {
        $pull: { friends: currentUserId }
    });

    // socket event
    const targetSocketId = activeUsers.getSocketId(targetUser._id.toString());
    if (targetSocketId) {
        getIO().to(targetSocketId).emit('unfriended', {
            by: {
                id: currentUserId,
                name: req.user.name,
                handle: req.user.handle,
            },
            message: `${req.user.name} has unfriended you.`,
        });
    }

    res.status(200).json({
        message: `You are no longer friends with ${targetUser.name}`,
    });
});

module.exports = unfriendUser;