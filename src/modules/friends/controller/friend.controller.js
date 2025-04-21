const asyncHandler = require('express-async-handler');
const ApiError = require('../../../util/APIError');
const User = require('../../user/model/user.model');
const Friend = require('../../friends/model/friend.model');
const { getIO } = require('../../../config/socket');
const activeUsers = require('../../../sockets/handlers/activeUsers');

/** @desc    Send a friend request
    * @route   POST /api/friends/requests/:handle/send
    * @access  Private
    */
exports.sendFriendRequest = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Accept friend request
 * @route   POST /api/friends/requests/@:handle/accept
 * @access  Private
 */
exports.acceptFriendRequest = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Reject a friend request
 * @route   POST /api/friends/requests/@:handle/reject
 * @access  Private
 */
exports.rejectFriendRequest = asyncHandler(async (req, res, next) => {
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

    const receiver = await User.findById(receiverId);
    receiver.friendRequests = receiver.friendRequests.filter(
        (id) => id.toString() !== sender._id.toString()
    );
    await receiver.save();

    const senderSocketId = activeUsers.getSocketId(sender._id.toString());
    if (senderSocketId) {
        getIO().to(senderSocketId).emit('friend_request_rejected', {
            to: {
                id: receiverId,
                name: req.user.name,
                handle: req.user.handle,
                avatar: req.user.avatar,
            },
            message: `${req.user.name} rejected your friend request!`,
        });
    }

    await Friend.deleteOne({ _id: friendRequest._id });

    res.status(200).json({
        message: `You rejected the friend request from ${sender.name}`,
    });
});

/**
 * @desc    Unfriend a user
 * @route   DELETE /api/friends/requests/unfriend/@:handle
 * @access  Private
 */
exports.unfriendUser = asyncHandler(async (req, res, next) => {
    const currentUserId = req.user.id;
    const targetHandle = '@' + req.params.handle;

    const targetUser = await User.findOne({ handle: targetHandle });
    if (!targetUser) {
        return next(new ApiError('User not found with this handle', 404));
    }

    const deleted = await Friend.findOneAndDelete({
        $or: [
            { requester: currentUserId, recipient: targetUser._id, status: 'Accepted' },
            { requester: targetUser._id, recipient: currentUserId, status: 'Accepted' },
        ],
    });

    if (!deleted) {
        return next(new ApiError('You are not friends with this user', 400));
    }

    await User.findByIdAndUpdate(currentUserId, {
        $pull: { friends: targetUser._id }
    });

    await User.findByIdAndUpdate(targetUser._id, {
        $pull: { friends: currentUserId }
    });

    // socket event
    const targetSocketId = activeUsers.getSocketId(targetUser._id.toString());
    if (targetSocketId) {
        getIO().to(targetSocketId).emit('unfriended', {
            by: {
                id: currentUserId,
                name: req.user.name,
                handle: req.user.handle,
            },
            message: `${req.user.name} has unfriended you.`,
        });
    }

    res.status(200).json({
        message: `You are no longer friends with ${targetUser.name}`,
    });
});

/**
 * @desc    Block a user
 * @route   POST /api/@:handle/block
 * @access  Private
 */
exports.blockUser = asyncHandler(async (req, res, next) => {
    const blockerId = req.user.id;
    const targetHandle = '@' + req.params.handle;

    const targetUser = await User.findOne({ handle: targetHandle });
    if (!targetUser) {
        return next(new ApiError('User not found with this handle', 404));
    }

    if (blockerId === targetUser._id.toString()) {
        return next(new ApiError('You cannot block yourself', 400));
    }

    const blocker = await User.findById(blockerId);

    if (blocker.blockedUsers.includes(targetUser._id)) {
        return next(new ApiError('User already blocked', 400));
    }

    await Friend.findOneAndDelete({
        $or: [
            { requester: blockerId, recipient: targetUser._id },
            { requester: targetUser._id, recipient: blockerId },
        ]
    });

    await User.findByIdAndUpdate(blockerId, {
        $pull: { friends: targetUser._id }
    });
    await User.findByIdAndUpdate(targetUser._id, {
        $pull: { friends: blockerId }
    });

    blocker.blockedUsers.push(targetUser._id);
    await blocker.save();

    const targetSocketId = activeUsers.getSocketId(targetUser._id.toString());
    if (targetSocketId) {
        getIO().to(targetSocketId).emit('blocked_by_user', {
            by: {
                id: blocker._id,
                name: blocker.name,
                handle: blocker.handle
            },
            message: `${blocker.name} has blocked you.`
        });
    }

    res.status(200).json({
        message: `You have blocked ${targetUser.name}`,
    });
});

/**
 * @desc    Unblock a user
 * @route   POST /api/@:handle/unblock
 * @access  Private
 */
exports.unblockUser = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const targetHandle = '@' + req.params.handle;

    const targetUser = await User.findOne({ handle: targetHandle });
    if (!targetUser) {
        return next(new ApiError('User not found with this handle', 404));
    }

    if (userId === targetUser._id.toString()) {
        return next(new ApiError('You cannot unblock yourself', 400));
    }

    const user = await User.findById(userId);

    if (!user.blockedUsers.includes(targetUser._id)) {
        return next(new ApiError('This user is not in your blocked list', 400));
    }

    user.blockedUsers = user.blockedUsers.filter(
        (id) => id.toString() !== targetUser._id.toString()
    );

    await user.save();

    const targetSocketId = activeUsers.getSocketId(targetUser._id.toString());
    if (targetSocketId) {
        getIO().to(targetSocketId).emit('unblocked_by_user', {
            by: {
                id: user._id,
                name: user.name,
                handle: user.handle
            },
            message: `${user.name} has unblocked you.`
        });
    }

    res.status(200).json({
        message: `You have unblocked ${targetUser.name}`,
    });
});

/**
 * @desc    Get all friends
 * @route   GET /api/friends
 * @access  Private
 */
exports.getFriends = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('friends', 'name handle avatar');
    res.status(200).json({ friends: user.friends });
});

/**
 * @desc    Get all friend requests
 * @route   GET /api/friends/requests
 * @access  Private
 */
exports.getFriendRequests = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('friendRequests', 'name handle avatar');
    res.status(200).json({ requests: user.friendRequests });
});

/**
 * @desc    Get all blocked users
 * @route   GET /api/friends/blocked
 * @access  Private
 */
exports.getBlockedUsers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('blockedUsers', 'name handle avatar');
    res.status(200).json({ blocked: user.blockedUsers });
});
