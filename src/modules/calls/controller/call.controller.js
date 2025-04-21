const startCall = require('./functions/startCall');
const joinCall = require('./functions/joinCall');
const leaveCall = require('./functions/leaveCall');
const getMembers = require('./functions/getMembers');
const endCall = require('./functions/endCall');
const getCalls = require('./functions/getCalls');
const getCallDuration = require('./functions/getCallDuration');

module.exports = {
    startCall,
    joinCall,
    leaveCall,
    getMembers,
    endCall,
    getCallDuration,
    getCalls
}