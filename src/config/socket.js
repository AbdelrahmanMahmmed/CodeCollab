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

            /**
             * @desc    Join a group
             * @param   {string} groupId - The ID of the group to join
             * @event   joinGroup
             * @access  Private
             */
            socket.on('joinGroup', (groupId) => {
                socket.join(groupId);
                console.log(`Socket ${socket.id} joined group ${groupId}`);
            });

            /**
             * @desc    Send a message to a group
             * @param   {string} groupId - The ID of the group to send the message to
             * @param   {object} message - The message object containing sender, type, content, and timestamp
             * @event   newMessage
             * @access  Private
             */
            socket.on('messageDeleted', ({ groupId, messageId }) => {
                io.to(groupId).emit('messageDeleted', { messageId });
                console.log(`Message with ID ${messageId} deleted in group ${groupId}`);
            });

            /**
             * @desc    Notify the user when they have been promoted to admin
             * @param   {object} promotionData - Data related to the promotion
             * @event   newAdminPromotion
             * @access  Private
             */
            socket.on('newAdminPromotion', ({ groupId, userId, adminName }) => {
                io.to(groupId).emit('newAdminPromotion', {
                    message: `Congratulations! You have been promoted to Admin by ${adminName}.`,
                    userId: userId,
                    groupId: groupId
                });
                console.log(`User ${userId} has been promoted to Admin in group ${groupId} by ${adminName}`);
            });

            /**
             * @desc    Disconnect from the server
             * @event   disconnect
             * @access  Private
             * @description This event is triggered when the client disconnects from the server.
             */
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });

            /**
             * @desc    Send a message to a group
             * @param   {object} message - The message object containing sender, type, content, and timestamp
             * @event   newMessage
             * @access  Private
             */

            socket.on('newMessage', (message) => {
                io.to(message.groupId).emit('newMessage', message);

                if (message.type === 'voice') {
                    console.log(`Voice message received in group ${message.groupId} from ${message.sender}`);
                } else {
                    console.log(`Message received in group ${message.groupId} from ${message.sender}`);
                }
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
