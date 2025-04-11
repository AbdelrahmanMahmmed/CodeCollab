const express = require('express');
const router = express.Router();

const { upload } = require('../../../util/UploadImage');

const { ProtectedRoters, allwedTo } = require('../../auth/controller/auth.controller');

const {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    inviteMember,
    acceptInvitation,
    rejectInvitation,
    leaveGroup,
    listGroupMembers,
    uploadImageForGroup,
    getPublicGroups,
    getMyGroups,
    removeMember,
    promoteToAdmin
} = require('../controller/group.controller');

router.post('/',
    ProtectedRoters,
    createGroup);

router.get('/public',
    ProtectedRoters,
    getPublicGroups);

router.get('/my',
    ProtectedRoters,
    getMyGroups);

router.route('/:groupId')
    .get(ProtectedRoters, getGroup)
    .put(ProtectedRoters, updateGroup)
    .delete(ProtectedRoters, deleteGroup);

router.post('/:groupId/invite',
    ProtectedRoters,
    inviteMember);

router.post('/:groupId/accept-invitation',
    ProtectedRoters,
    acceptInvitation);

router.post('/:groupId/reject-invitation',
    ProtectedRoters,
    rejectInvitation);

router.post('/:groupId/leave',
    ProtectedRoters,
    leaveGroup);

router.get('/:groupId/members',
    ProtectedRoters,
    listGroupMembers);

router.post('/:groupId/upload-image',
    ProtectedRoters,
    upload.single('image'),
    uploadImageForGroup);

router.post('/:groupId/members/:userId',
    ProtectedRoters,
    removeMember);

router.put('/:groupId/promote/:userId', 
    ProtectedRoters, 
    promoteToAdmin);


module.exports = router;
