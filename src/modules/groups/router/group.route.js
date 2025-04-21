const express = require('express');
const router = express.Router();

const { upload } = require('../../../util/UploadImage');

const { middlewareFunctions } = require('../../auth/controller/auth.controller');

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

router.use(middlewareFunctions.ProtectedRoters);


router.post('/',createGroup);

router.get('/public',getPublicGroups);

router.get('/my',getMyGroups);

router.route('/:groupId')
    .get( getGroup)
    .put( updateGroup)
    .delete( deleteGroup);

router.post('/:groupId/invite',inviteMember);

router.post('/:groupId/accept-invitation',acceptInvitation);

router.post('/:groupId/reject-invitation',rejectInvitation);

router.post('/:groupId/leave',leaveGroup);

router.get('/:groupId/members',listGroupMembers);

router.post('/:groupId/upload-image', upload.single('image'),uploadImageForGroup);

router.post('/:groupId/members/:userId',removeMember);

router.put('/:groupId/promote/:userId',promoteToAdmin);


module.exports = router;
