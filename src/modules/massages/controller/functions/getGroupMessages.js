const {Group,asyncHandler,ApiError} = require('../massages.dependencies')
const decryptMessages = require('../../../../util/decrypted');

/**
 * @desc    Get messages from a group
 * @route   GET /api/v1/group/:groupId/messages
 * @access  Private
 */
const getGroupMessages = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId).populate('messages.sender'); 
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.includes(userId) || group.admin.toString() === userId.toString();
    if (!isMember) return next(new ApiError("You are not a member of this group", 403));

    const decryptedMessages = decryptMessages(group.messages, process.env.SECRET_KEY);

    res.status(200).json({ messages: decryptedMessages });
});

module.exports = getGroupMessages;