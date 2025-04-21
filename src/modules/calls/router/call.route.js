const express = require('express');
const router = express.Router();


const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const callController = require('../controller/call.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.route('/:groupId/start')
    .post(callController.startCall);

router.route('/:groupId/end')
    .post(callController.endCall);

router.route('/:groupId/join')
    .post(callController.joinCall);

router.route('/:groupId/leave')
    .post(callController.leaveCall);

router.route('/:groupId/duration')
    .get(callController.getCallDuration);

router.route('/:groupId/members')
    .get(callController.getMembers);

router.route('/:groupId/calls')
    .get(callController.getCalls);

module.exports = router;
