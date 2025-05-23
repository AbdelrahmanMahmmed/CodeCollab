const express = require('express');
const router = express.Router();


const { middlewareFunctions } = require('../../auth/controller/auth.controller');
const { upload } = require('../../../util/UploadImage');

const friendController = require('../controller/friend.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.route('/requests/@:handle/send')
    .post(friendController.sendrequest);

router.route('/requests/@:handle/accept')
    .post(friendController.acceptrequest);

router.route('/requests/@:handle/reject')
    .post(friendController.rejectrequest);

router.route('/requests/@:handle/unfriend')
    .post(friendController.unfriend);

router.route('/requests/@:handle/block')
    .post(friendController.blockFriend);

router.route('/requests/@:handle/unblock')
    .post(friendController.unblockFriend);

router.route('/')
    .get(friendController.getFriends.getFriends);

router.route('/requests')
    .get(friendController.getFriends.getFriendRequests);

router.route('/blocked')
    .get(friendController.getFriends.getBlockedUsers);

router.route('/message/@:handle')
    .post(friendController.sendMessageToFriend)

router.route('/message/:messageId/@:handle')
    .put(friendController.updateMeassage)
    .delete(friendController.deleteMeassage);

router.route('/messages/@:handle')
    .get(friendController.getMeassages);

router.route('/messages/@:handle/send-image')
    .post( upload.single('image'),friendController.SendImage);

module.exports = router;