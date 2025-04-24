const {Group,asyncHandler,ApiError,getIO,CryptoJS} = require('../massages.dependencies')
const encryptedContented = require('../../../../util/encrypted');
/**
 * @desc    Send a message to a group
 * @route   POST /api/v1/group/:groupId/message
 * @access  Private
 */
const sendMessage = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const { type = 'text', content } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.includes(userId);
    if (!isMember) return next(new ApiError("You are not a member of this group", 403));

    const encryptedContent = encryptedContented(content, type);

    const newMessage = {
        sender: userId,
        type,
        content: encryptedContent,
        timestamp: Date.now()
    };

    group.messages.push(newMessage);
    await group.save();

    const io = getIO();

    io.to(groupId.toString()).emit("newMessage", {
        sender: req.user.name,
        type,
        content,
        timestamp: newMessage.timestamp
    });

    res.status(201).json({ message: "Message sent" });
});

module.exports = sendMessage;