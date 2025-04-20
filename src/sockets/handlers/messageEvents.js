module.exports = (socket, io) => {
    socket.on('newMessage', (message) => {
        io.to(message.groupId).emit('newMessage', message);
        const logType = message.type === 'voice' ? 'Voice' : 'Text';
        console.log(`${logType} message in group ${message.groupId} from ${message.sender}`);
    });

    socket.on('typing', ({ groupId, userId }) => {
        socket.to(groupId).emit('typing', { userId });
    });
};
