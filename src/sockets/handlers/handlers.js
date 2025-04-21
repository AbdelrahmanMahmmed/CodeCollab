const activeUsers = require('./activeUsers');

module.exports = (socket, io) => {
    socket.on('register', (userId) => {
        activeUsers.setUser(userId, socket.id);
        console.log(`✅ User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        activeUsers.removeUser(socket.id);
        console.log(`Socket ${socket.id} disconnected`);
    });

    socket.on('getOnlineFriends', (friendIds, callback) => {
        const onlineFriends = friendIds.filter(id => activeUsers.getSocketId(id));
        callback(onlineFriends);
    });
};
