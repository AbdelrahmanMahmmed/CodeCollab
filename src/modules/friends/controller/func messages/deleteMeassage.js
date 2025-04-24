const { ApiError, Friend, User, asyncHandler, getIO } = require('../friends.dependencies');

/**
 * @desc    Delete a specific message in a friend chat (by handle)
 * @route   DELETE /api/v1/friends/:handle/messages/:messageId
 * @access  Private
 */
const deleteMessage = asyncHandler(async (req, res, next) => {
    const receiverHandle = '@' + req.params.handle;
    const { messageId } = req.params;
    const userId = req.user._id;

    const receiver = await User.findOne({ handle: receiverHandle });
    if (!receiver) return next(new ApiError("User not found with this handle", 404));

    const friendship = await Friend.findOne({
        $or: [
            { requester: userId, recipient: receiver._id, status: 'Accepted' },
            { requester: receiver._id, recipient: userId, status: 'Accepted' }
        ]
    });

    if (!friendship) return next(new ApiError("Friendship not found", 404));

    const messageIndex = friendship.massages.findIndex(msg => msg._id.toString() === messageId);
    if (messageIndex === -1) return next(new ApiError("Message not found", 404));

    const message = friendship.massages[messageIndex];
    if (message.sender.toString() !== userId.toString()) {
        return next(new ApiError("You can only delete your own messages", 403));
    }

    friendship.massages.splice(messageIndex, 1);
    await friendship.save();

    const io = getIO();
    const usersToNotify = [userId.toString(), receiver._id.toString()];
    usersToNotify.forEach(user => {
        io.to(user).emit("friend-message-deleted", {
            friendId: receiver._id,
            messageId
        });
    });

    res.status(200).json({ message: "Message deleted successfully" });
});

module.exports = deleteMessage;
