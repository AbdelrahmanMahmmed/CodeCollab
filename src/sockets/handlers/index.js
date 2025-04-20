const groupEvents = require('./groupEvents');
const messageEvents = require('./messageEvents');
const callEvents = require('./callEvents');
const compilerEvents = require('./compilerEvents');

module.exports = (socket, io) => {
    groupEvents(socket, io);
    messageEvents(socket, io);
    callEvents(socket, io);
    compilerEvents(socket, io);
};
