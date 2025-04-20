module.exports = (socket, io) => {
    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on('messageDeleted', ({ groupId, messageId }) => {
        io.to(groupId).emit('messageDeleted', { messageId });
        console.log(`Message ${messageId} deleted in group ${groupId}`);
    });

    socket.on('newAdminPromotion', ({ groupId, userId, adminName }) => {
        io.to(groupId).emit('newAdminPromotion', {
            message: `Congratulations! You have been promoted to Admin by ${adminName}.`,
            userId,
            groupId
        });
        console.log(`User ${userId} promoted to Admin in group ${groupId}`);
    });
};
