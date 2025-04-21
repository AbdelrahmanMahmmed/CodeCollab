const getprofile = require('./functions/getprofile');
const editName = require('./functions/editName');
const editStatus = require('./functions/editStatus');
const bolckUser = require('./functions/BlockedUser');
const unblockUser = require('./functions/UnBlockedUser');
const getUserByHandle = require('./functions/getUserByHandle');

module.exports = {
    getprofile,
    editName,
    editStatus,
    bolckUser,
    unblockUser,
    getUserByHandle
}