const express = require('express');
const router = express.Router();

const { ProtectedRoters } = require('../../auth/controller/auth.controller');


const {
    sendMessage,
    getGroupMessages,
    deleteMessage
} = require('../controller/massage.controller');


router.get('/:groupId/messages', ProtectedRoters, getGroupMessages);

router.post('/:groupId/message', ProtectedRoters, sendMessage);

router.delete('/:groupId/message/:messageId', ProtectedRoters, deleteMessage);

module.exports = router;