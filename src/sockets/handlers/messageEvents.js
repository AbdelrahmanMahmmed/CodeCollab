module.exports = (socket, io) => {
    socket.on('newMessage', (message) => {
        io.to(message.groupId).emit('newMessage', message);
        const logType = message.type === 'voice' ? 'Voice' : message.type === 'image' ? 'Image' : 'Text';
        console.log(`${logType} message in group ${message.groupId} from ${message.sender}`);
    });

    socket.on('typing', ({ groupId, userId }) => {
        socket.to(groupId).emit('typing', { userId });
    });

    socket.on('sendImageMessage', (message) => {
        io.to(message.groupId).emit('newImageMessage', message);
        console.log(`Image message in group ${message.groupId} from ${message.sender}`);
    });

    socket.on('sendVoiceMessage', (message) => {
        io.to(message.groupId).emit('newVoiceMessage', message);
        console.log(`Voice message in group ${message.groupId} from ${message.sender}`);
    });
};
