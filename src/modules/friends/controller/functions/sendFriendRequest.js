const {ApiError,User,Friend,getIO,activeUsers,asyncHandler} = require('../friends.dependencies');

/** @desc    Send a friend request
    * @route   POST /api/friends/requests/:handle/send
    * @access  Private
    */
const sendFriendRequest = asyncHandler(async (req, res, next) => {
    const senderId = req.user.id;
    const receiverHandle = '@' + req.params.handle;

    const receiver = await User.findOne({ handle: receiverHandle });
    if (!receiver) {
        return next(new ApiError('User not found with this handle', 404));
    }

    if (receiver._id.toString() === senderId) {
        return next(new ApiError('You cannot send a friend request to yourself', 400));
    }

    const existing = await Friend.findOne({
        $or: [
            { requester: senderId, recipient: receiver._id },
            { requester: receiver._id, recipient: senderId },
        ],
    });

    if (existing) {
        return next(new ApiError('Friend request already sent or already friends', 400));
    }

    await Friend.create({
        requester: senderId,
        recipient: receiver._id,
        status: 'Pending',
    });

    receiver.friendRequests.push(senderId);
    await receiver.save();

    const receiverSocketId = activeUsers.getSocketId(receiver._id.toString());
    if (receiverSocketId) {
        getIO().to(receiverSocketId).emit('friend_request', {
            from: {
                id: req.user._id,
                name: req.user.name,
                handle: req.user.handle,
                avatar: req.user.avatar,
            },
            message: `${req.user.name} sent you a friend request!`
        });
    }

    res.status(201).json({
        message: `Friend request sent to ${receiver.name}`,
    });
});

module.exports = sendFriendRequest;