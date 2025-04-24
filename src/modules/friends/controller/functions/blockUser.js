const {ApiError,User,Friend,getIO,activeUsers,asyncHandler} = require('../friends.dependencies');

/**
 * @desc    Block a user
 * @route   POST /api/@:handle/block
 * @access  Private
 */
const blockFriend = asyncHandler(async (req, res, next) => {
    const blockerId = req.user.id;
    const targetHandle = '@' + req.params.handle;

    const targetUser = await User.findOne({ handle: targetHandle });
    if (!targetUser) {
        return next(new ApiError('User not found with this handle', 404));
    }

    if (blockerId === targetUser._id.toString()) {
        return next(new ApiError('You cannot block yourself', 400));
    }

    const blocker = await User.findById(blockerId);

    if (blocker.blockedUsers.includes(targetUser._id)) {
        return next(new ApiError('User already blocked', 400));
    }

    await Friend.findOneAndDelete({
        $or: [
            { requester: blockerId, recipient: targetUser._id },
            { requester: targetUser._id, recipient: blockerId },
        ]
    });

    await User.findByIdAndUpdate(blockerId, {
        $pull: { friends: targetUser._id }
    });
    await User.findByIdAndUpdate(targetUser._id, {
        $pull: { friends: blockerId }
    });

    blocker.blockedUsers.push(targetUser._id);
    await blocker.save();

    const targetSocketId = activeUsers.getSocketId(targetUser._id.toString());
    if (targetSocketId) {
        getIO().to(targetSocketId).emit('blocked_by_user', {
            by: {
                id: blocker._id,
                name: blocker.name,
                handle: blocker.handle
            },
            message: `${blocker.name} has blocked you.`
        });
    }

    res.status(200).json({
        message: `You have blocked ${targetUser.name}`,
    });
});

module.exports = blockFriend;