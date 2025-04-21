const express = require('express');
const router = express.Router();


const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const {
    startCall,
    leaveCall,
    joinCall,
    getMembers,
    getCallDuration,
    endCall,
    getCalls
} = require('../controller/call.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.route('/:groupId/start')
    .post(startCall);

router.route('/:groupId/end')
    .post(endCall);

router.route('/:groupId/join')
    .post(joinCall);

router.route('/:groupId/leave')
    .post(leaveCall);

router.route('/:groupId/duration')
    .get(getCallDuration);

router.route('/:groupId/members')
    .get(getMembers);

router.route('/:groupId/calls')
    .get(getCalls);

module.exports = router;
