const {Group,asyncHandler,ApiError,getIO,CryptoJS} = require('../massages.dependencies')
/**
 * @desc    Delete a message from a group
 * @route   DELETE /api/groups/:groupId/message/:messageId
 * @access  Private
 */
const deleteMessage = asyncHandler(async (req, res, next) => {
    const { groupId, messageId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    const message = group.messages.id(messageId);
    if (!message) return next(new ApiError("Message not found", 404));

    const isOwner = message.sender.toString() === userId.toString();
    const isAdmin = group.admin.toString() === userId.toString();

    if (!isOwner && !isAdmin) {
        return next(new ApiError("You don't have permission to delete this message", 403));
    }

    group.messages.pull(messageId);
    await group.save();

    const io = getIO();
    io.to(groupId).emit('messageDeleted', { messageId });

    res.status(200).json({ message: "Message deleted successfully" });
});

module.exports = deleteMessage;
