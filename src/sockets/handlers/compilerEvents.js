module.exports = (socket, io) => {
    socket.on('openCompiler', ({ groupId }) => {
        io.to(groupId).emit('compilerOpened');
        console.log(`Compiler opened in group ${groupId}`);
    });


    socket.on('codeUpdated', ({ groupId, code }) => {
        socket.to(groupId).emit('codeUpdated', { code });
        console.log(`Code updated in group ${groupId}`);
    });
};
