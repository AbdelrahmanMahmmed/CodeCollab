const {Group,asyncHandler,ApiError,getIO,CryptoJS} = require('../massages.dependencies')

/**
 * @desc    Get messages from a group
 * @route   GET /api/v1/group/:groupId/messages
 * @access  Private
 */
const getGroupMessages = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId).populate('messages.sender', 'name avatar phone');
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.includes(userId) || group.admin.toString() === userId.toString();
    if (!isMember) return next(new ApiError("You are not a member of this group", 403));

    const messages = group.messages.map(msg => {
        const decrypted = msg.type === 'text'
            ? CryptoJS.AES.decrypt(msg.content, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
            : msg.content;

        return {
            sender: msg.sender.name,
            type: msg.type,
            content: decrypted,
            timestamp: msg.timestamp
        };
    });

    res.status(200).json({ messages });
});

module.exports = getGroupMessages;