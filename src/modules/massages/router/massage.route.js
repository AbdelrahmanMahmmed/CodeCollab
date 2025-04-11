const express = require('express');
const router = express.Router();

const { ProtectedRoters } = require('../../auth/controller/auth.controller');


const {
    sendMessage,
    getGroupMessages,
} = require('../controller/massage.controller');


router.get('/:groupId/messages', ProtectedRoters, getGroupMessages);

router.post('/:groupId/message', ProtectedRoters, sendMessage);



module.exports = router;