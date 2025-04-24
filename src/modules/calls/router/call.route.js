const express = require('express');
const router = express.Router();


const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const CallVaild = require('../validator/call.validator');
const callController = require('../controller/call.controller');


router.use(middlewareFunctions.ProtectedRoters);

router.route('/:groupId/start')
    .post(CallVaild.StartCallVaild,callController.startCall);

router.route('/:groupId/end')
    .post(CallVaild.EndCallVaild,callController.endCall);

router.route('/:groupId/join')
    .post(CallVaild.JoinCallVaild,callController.joinCall);

router.route('/:groupId/leave')
    .post(CallVaild.LeaveCallVaild,callController.leaveCall);

router.route('/:groupId/duration')
    .get(CallVaild.GetVaild,callController.getCallDuration);

router.route('/:groupId/members')
    .get(CallVaild.GetVaild,callController.getMembers);

router.route('/:groupId/calls')
    .get(CallVaild.GetVaild,callController.getCalls);

module.exports = router;
