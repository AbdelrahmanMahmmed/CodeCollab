const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Promote a user to admin (Admin only)
 * @route   PUT /api/groups/:groupId/promote/:userId
 * @access  Private (only Admin)
 */
const promoteToAdmin = asyncHandler(async (req, res, next) => {
    const { groupId, userId } = req.params;
    const loggedInUserId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    if (group.admin.toString() !== loggedInUserId.toString()) {
        return next(new ApiError("You are not authorized to perform this action", 403));
    }

    if (group.admin.toString() === userId.toString()) {
        return next(new ApiError("This user is already the admin of the group", 400));
    }

    const isMember = group.members.includes(userId);
    if (!isMember) {
        return next(new ApiError("User is not a member of the group", 400));
    }

    if (group.otherAdmin.includes(userId)) {
        return next(new ApiError("This user is already an admin", 400));
    }

    group.otherAdmin.push(userId);
    await group.save();

    const adminMessage = {
        sender: loggedInUserId,
        type: 'text',
        content: `Congratulations! You've been promoted to admin in the group "${group.name}".`,
        timestamp: Date.now()
    };

    group.messages.push(adminMessage);
    await group.save();

    const io = getIO();
    io.to(groupId).emit('newMessage', {
        sender: 'System',
        type: 'text',
        content: adminMessage.content,
        timestamp: adminMessage.timestamp
    });

    res.status(200).json({ message: "User has been promoted to admin and notified." });
});

module.exports = promoteToAdmin ;