const express = require('express');
const router = express.Router();


const { ProtectedRoters } = require('../../auth/controller/auth.controller');

const {
    startCall,
    leaveCall,
    joinCall,
    getMembers,
    getCallDuration,
    endCall,
    getCalls
} = require('../controller/call.controller');


router.route('/:groupId/start')
    .post(ProtectedRoters, startCall);

router.route('/:groupId/end')
    .post(ProtectedRoters, endCall);

router.route('/:groupId/join')
    .post(ProtectedRoters, joinCall);

router.route('/:groupId/leave')
    .post(ProtectedRoters, leaveCall);

router.route('/:groupId/duration')
    .get(ProtectedRoters, getCallDuration);

router.route('/:groupId/members')
    .get(ProtectedRoters, getMembers);

router.route('/:groupId/calls')
    .get(ProtectedRoters, getCalls);

module.exports = router;
