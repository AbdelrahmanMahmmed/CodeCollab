const { ApiError, Friend, User, asyncHandler, getIO } = require('../friends.dependencies');
const encryptedContented = require('../../../../util/encrypted');

/**
 * @desc    Update a specific message in a friend chat (by handle)
 * @route   PUT /api/v1/friends/:handle/messages/:messageId
 * @access  Private
 */
const updateMessage = asyncHandler(async (req, res, next) => {
    const receiverHandle = '@' + req.params.handle;
    const { messageId } = req.params;
    const { newMessage } = req.body;
    const userId = req.user._id;

    if (!newMessage || typeof newMessage !== 'string') {
        return next(new ApiError("New message must be a non-empty string", 400));
    }

    const receiver = await User.findOne({ handle: receiverHandle });
    if (!receiver) return next(new ApiError("User not found with this handle", 404));

    const friendship = await Friend.findOne({
        $or: [
            { requester: userId, recipient: receiver._id, status: 'Accepted' },
            { requester: receiver._id, recipient: userId, status: 'Accepted' }
        ]
    });

    if (!friendship) return next(new ApiError("Friendship not found", 404));

    const message = friendship.massages.find(msg => msg._id.toString() === messageId);
    if (!message) return next(new ApiError("Message not found", 404));

    if (message.sender.toString() !== userId.toString()) {
        return next(new ApiError("You can only edit your own messages", 403));
    }

    if (message.messageType !== 'text') {
        return next(new ApiError("Only text messages can be edited", 400));
    }

    const encryptedContent = encryptedContented(newMessage, 'text');

    message.message = encryptedContent;

    await friendship.save();

    const io = getIO();
    const usersToNotify = [userId.toString(), receiver._id.toString()];
    usersToNotify.forEach(user => {
        io.to(user).emit("friend-message-updated", {
            friendId: receiver._id,
            messageId,
            newContent: newMessage
        });
    });

    res.status(200).json({ message: "Message updated successfully" });
});

module.exports = updateMessage;
