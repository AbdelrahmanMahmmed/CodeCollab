let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            
            require('../sockets/handlers')(socket, io);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    }
};