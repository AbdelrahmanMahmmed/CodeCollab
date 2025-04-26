const { ApiError, User, Friend, getIO, activeUsers, asyncHandler } = require('../friends.dependencies');
const encryptedContented = require('../../../../util/en-de-text.js/encrypted');
const SECRET = process.env.SECRET_KEY;

const sendMessageToFriend = asyncHandler(async (req, res, next) => {
    const senderId = req.user.id;
    const receiverHandle = '@' + req.params.handle;
    const { message, messageType = 'text' } = req.body;

    if (!message) {
        return next(new ApiError('Message are required', 400));
    }

    const receiver = await User.findOne({ handle: receiverHandle });
    if (!receiver) {
        return next(new ApiError('User not found', 404));
    }

    const friendship = await Friend.findOne({
        $or: [
            { requester: senderId, recipient: receiver._id, status: 'Accepted' },
            { requester: receiver._id, recipient: senderId, status: 'Accepted' },
        ]
    });

    if (!friendship) {
        return next(new ApiError('You are not friends with this user', 403));
    }

    const createdAt = new Date();

    const encryptedContent = encryptedContented(message, SECRET);
    console.log("Encrypting with SECRET:", SECRET);

    friendship.massages.push({
        sender: senderId,
        message: encryptedContent,
        messageType,
        createdAt
    });

    await friendship.save();

    const receiverSocketId = activeUsers.getSocketId(receiver._id.toString());

    if (receiverSocketId) {
        getIO().to(receiverSocketId).emit('new_message', {
            from: {
                id: req.user._id,
                name: req.user.name,
                handle: req.user.handle,
                avatar: req.user.avatar
            },
            to: receiver._id,
            message,
            messageType,
            createdAt
        });
    }

    res.status(201).json({
        message: 'Message sent successfully',
    });
});

module.exports = sendMessageToFriend;