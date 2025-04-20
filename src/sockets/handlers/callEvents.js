module.exports = (socket, io) => {
    socket.on('webrtc-offer', ({ groupId, offer, senderId }) => {
        socket.to(groupId).emit('webrtc-offer', { offer, senderId });
    });

    

    socket.on('webrtc-answer', ({ groupId, answer, senderId }) => {
        socket.to(groupId).emit('webrtc-answer', { answer, senderId });
    });



    socket.on('webrtc-candidate', ({ groupId, candidate, senderId }) => {
        socket.to(groupId).emit('webrtc-candidate', { candidate, senderId });
    });



    socket.on('callStarted', ({ groupId, callId, startedBy, startedAt }) => {
        io.to(groupId).emit('callStarted', { groupId, callId, startedBy, startedAt });
        console.log(`Call started in group ${groupId} by ${startedBy}`);
    });


    
    socket.on('callEnded', ({ message, groupId }) => {
        console.log(message);
    });
};
