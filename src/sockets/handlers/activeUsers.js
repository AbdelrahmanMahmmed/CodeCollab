const userSocketMap = new Map(); // userId => socketId

module.exports = {
    setUser: (userId, socketId) => userSocketMap.set(userId, socketId),
    removeUser: (socketId) => {
        for (const [userId, sId] of userSocketMap.entries()) {
            if (sId === socketId) {
                userSocketMap.delete(userId);
                break;
            }
        }
    },
    getSocketId: (userId) => userSocketMap.get(userId),
};
