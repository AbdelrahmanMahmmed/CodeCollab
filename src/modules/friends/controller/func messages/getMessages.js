const decrypted = require('../../../../util/en-de-text.js/decrypted');
const { ApiError, Friend, User, asyncHandler } = require('../friends.dependencies');
const SECRET = process.env.SECRET_KEY;

/**
 * @desc    Get messages from a friend by handle
 * @route   GET /api/v1/friends/:handle/messages
 * @access  Private
 */

const getMessages = asyncHandler(async (req, res, next) => {
    const receiverHandle = '@' + req.params.handle;
    const userId = req.user._id;

    const friendUser = await User.findOne({ handle: receiverHandle });
    if (!friendUser) return next(new ApiError("User not found", 404));

    const friendship = await Friend.findOne({
        $or: [
            { requester: userId, recipient: friendUser._id, status: 'Accepted' },
            { requester: friendUser._id, recipient: userId, status: 'Accepted' }
        ]
    }).populate('massages.sender', 'name avatar');

    if (!friendship) return next(new ApiError("You are not friends with this user", 403));

    const decryptedMessages = friendship.massages.map(msg => {
        try {
            const decryptedContent = decrypted(msg.message, SECRET);
            return {
                sender: {
                    name: msg.sender.name,
                    image: msg.sender.avatar || null,
                },
                content: decryptedContent,
                messageType: msg.messageType,
                createdAt: msg.createdAt,
            };
        } catch (error) {
            return {
                sender: {
                    name: msg.sender.name,
                    image: msg.sender.avatar || null,
                },
                content: msg.message,
                messageType: msg.messageType,
                createdAt: msg.createdAt,
            };
        }
    });

    res.status(200).json({ messages: decryptedMessages });
});

module.exports = getMessages;
