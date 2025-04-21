const createGroup = require('./functions/createGroup');
const getGroup = require('./functions/getGroup');
const acceptInvitation = require('./functions/acceptInvitation');
const deleteGroup = require('./functions/deleteGroup');
const getMyGroups = require('./functions/getMyGroups');
const getPublicGroups = require('./functions/getPublicGroups');
const inviteMember = require('./functions/inviteMember');
const leaveGroup = require('./functions/leaveGroup');
const listGroupMembers = require('./functions/listGroupMembers');
const promoteToAdmin = require('./functions/promoteToAdmin');
const rejectInvitation = require('./functions/rejectInvitation');
const updateGroup = require('./functions/updateGroup');
const removeMember = require('./functions/removeMember');
const uploadImageForGroup = require('./functions/uploadImageForGroup');

module.exports = {
    createGroup,
    getGroup,
    acceptInvitation,
    deleteGroup,
    getMyGroups,
    getPublicGroups,
    inviteMember,
    leaveGroup,
    listGroupMembers,
    promoteToAdmin,
    rejectInvitation,
    updateGroup,
    removeMember,
    uploadImageForGroup
};