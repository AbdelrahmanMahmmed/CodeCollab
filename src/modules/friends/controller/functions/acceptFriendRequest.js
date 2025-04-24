const {ApiError,User,Friend,getIO,activeUsers,asyncHandler} = require('../friends.dependencies');

/**
 * @desc    Accept friend request
 * @route   POST /api/friends/requests/@:handle/accept
 * @access  Private
 */
const acceptFriendRequest = asyncHandler(async (req, res, next) => {
    const receiverId = req.user.id;
    const senderHandle = '@' + req.params.handle;

    const sender = await User.findOne({ handle: senderHandle });
    if (!sender) {
        return next(new ApiError('Sender not found', 404));
    }

    const friendRequest = await Friend.findOne({
        $or: [
            { requester: sender._id, recipient: receiverId, status: 'Pending' },
            { requester: receiverId, recipient: sender._id, status: 'Pending' },
        ],
    });

    if (!friendRequest) {
        return next(new ApiError('No pending friend request found', 404));
    }

    friendRequest.status = 'Accepted';
    await friendRequest.save();

    const receiver = await User.findById(receiverId);
    receiver.friendRequests = receiver.friendRequests.filter(
        (id) => id.toString() !== sender._id.toString()
    );
    receiver.friends.push(sender._id);
    await receiver.save();

    sender.friendRequests = sender.friendRequests.filter(
        (id) => id.toString() !== receiver._id.toString()
    );
    sender.friends.push(receiver._id);
    await sender.save();

    const senderSocketId = activeUsers.getSocketId(sender._id.toString());
    if (senderSocketId) {
        getIO().to(senderSocketId).emit('friend_request_accepted', {
            to: {
                id: receiverId,
                name: req.user.name,
                handle: req.user.handle,
                avatar: req.user.avatar,
            },
            message: `${req.user.name} accepted your friend request!`,
        });
    }

    res.status(200).json({
        message: `You accepted the friend request from ${sender.name}`,
    });
});

module.exports = acceptFriendRequest;