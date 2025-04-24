const sendrequest = require('./functions/sendFriendRequest');
const acceptrequest = require('./functions/acceptFriendRequest');
const rejectrequest = require('./functions/rejectFriendRequest');
const blockFriend = require('./functions/blockUser');
const unblockFriend = require('./functions/unblockUser');
const getFriends = require('./functions/getFriends');
const unfriend = require('./functions/unfriendUser');
const sendMessageToFriend = require('./func messages/sendMessageToFriend')
const getMeassages = require('./func messages/getMessages')
module.exports = {
    sendrequest,
    acceptrequest,
    rejectrequest,
    blockFriend,
    unblockFriend,
    getFriends,
    unfriend,
    sendMessageToFriend,
    getMeassages
}