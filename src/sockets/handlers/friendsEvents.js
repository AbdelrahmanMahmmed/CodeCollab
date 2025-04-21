const { getIO } = require('../../config/socket');
const activeUsers = require('./activeUsers');

// Send friend request
exports.emitFriendRequest = (receiverId, senderInfo) => {
    const socketId = activeUsers.getSocketId(receiverId);
    if (socketId) {
        getIO().to(socketId).emit('friend_request', {
            from: senderInfo,
            message: `${senderInfo.name} sent you a friend request!`
        });
    }
};

// Accept friend request
exports.emitFriendRequestAccepted = (senderId, receiverInfo) => {
    const socketId = activeUsers.getSocketId(senderId);
    if (socketId) {
        getIO().to(socketId).emit('friend_request_accepted', {
            to: receiverInfo,
            message: `${receiverInfo.name} accepted your friend request!`
        });
    }
};

// Reject friend request
exports.emitFriendRequestRejected = (senderId, receiverInfo) => {
    const socketId = activeUsers.getSocketId(senderId);
    if (socketId) {
        getIO().to(socketId).emit('friend_request_rejected', {
            to: receiverInfo,
            message: `${receiverInfo.name} rejected your friend request.`
        });
    }
};

// Unfriend
exports.emitUnfriend = (friendId, userInfo) => {
    const socketId = activeUsers.getSocketId(friendId);
    if (socketId) {
        getIO().to(socketId).emit('unfriend', {
            from: userInfo,
            message: `${userInfo.name} removed you from their friends.`
        });
    }
};

// Block
exports.emitBlocked = (blockedId, blockerInfo) => {
    const socketId = activeUsers.getSocketId(blockedId);
    if (socketId) {
        getIO().to(socketId).emit('blocked', {
            by: blockerInfo,
            message: `${blockerInfo.name} blocked you.`
        });
    }
};

// Unblock
exports.emitUnblocked = (unblockedId, userInfo) => {
    const socketId = activeUsers.getSocketId(unblockedId);
    if (socketId) {
        getIO().to(socketId).emit('unblocked', {
            by: userInfo,
            message: `${userInfo.name} unblocked you.`
        });
    }
};
