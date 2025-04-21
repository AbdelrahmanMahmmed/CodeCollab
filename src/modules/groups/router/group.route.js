const express = require('express');
const router = express.Router();

const { upload } = require('../../../util/UploadImage');

const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const groupController = require('../controller/group.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.post('/',groupController.createGroup);

router.get('/public',groupController.getPublicGroups);

router.get('/my',groupController.getMyGroups);

router.route('/:groupId')
    .get( groupController.getGroup)
    .put( groupController.updateGroup)
    .delete( groupController.deleteGroup);

router.post('/:groupId/invite',groupController.inviteMember);

router.post('/:groupId/accept-invitation',groupController.acceptInvitation);

router.post('/:groupId/reject-invitation',groupController.rejectInvitation);

router.post('/:groupId/leave',groupController.leaveGroup);

router.get('/:groupId/members',groupController.listGroupMembers);

router.post('/:groupId/upload-image', upload.single('image'),groupController.uploadImageForGroup);

router.post('/:groupId/members/:userId',groupController.removeMember);

router.put('/:groupId/promote/:userId',groupController.promoteToAdmin);


module.exports = router;
