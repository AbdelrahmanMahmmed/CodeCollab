const express = require('express');
const router = express.Router();


const { ProtectedRoters } = require('../../auth/controller/auth.controller');

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


router.route('/requests/@:handle/send')
    .post(ProtectedRoters, sendFriendRequest);

router.route('/requests/@:handle/accept')
    .post(ProtectedRoters, acceptFriendRequest);

router.route('/requests/@:handle/reject')
    .post(ProtectedRoters, rejectFriendRequest);

router.route('/requests/@:handle/unfriend')
    .post(ProtectedRoters, unfriendUser);

router.route('/requests/@:handle/block')
    .post(ProtectedRoters, blockUser);

router.route('/requests/@:handle/unblock')
    .post(ProtectedRoters, unblockUser);

router.route('/')
    .get(ProtectedRoters, getFriends);

router.route('/requests')
    .get(ProtectedRoters, getFriendRequests);

router.route('/blocked')
    .get(ProtectedRoters, getBlockedUsers);

module.exports = router;