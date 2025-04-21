const express = require('express');
const router = express.Router();


const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    unfriendUser,
    blockUser,
    unblockUser,
    getFriendRequests,
    getFriends,
    getBlockedUsers,
} = require('../controller/friend.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.route('/requests/@:handle/send')
    .post(sendFriendRequest);

router.route('/requests/@:handle/accept')
    .post(acceptFriendRequest);

router.route('/requests/@:handle/reject')
    .post(rejectFriendRequest);

router.route('/requests/@:handle/unfriend')
    .post(unfriendUser);

router.route('/requests/@:handle/block')
    .post(blockUser);

router.route('/requests/@:handle/unblock')
    .post(unblockUser);

router.route('/')
    .get(getFriends);

router.route('/requests')
    .get(getFriendRequests);

router.route('/blocked')
    .get(getBlockedUsers);

module.exports = router;