const express = require('express');
const router = express.Router();

const { ProtectedRoters } = require('../../auth/controller/auth.controller');

const upload = require('../../../util/uploadVoice');

const {
    sendMessage,
    getGroupMessages,
    deleteMessage,
    sendVoiceMessage
} = require('../controller/massage.controller');


router.get('/:groupId/messages', ProtectedRoters, getGroupMessages);

router.post('/:groupId/message', ProtectedRoters, sendMessage);

router.delete('/:groupId/message/:messageId', ProtectedRoters, deleteMessage);

router.post('/:groupId/voice', ProtectedRoters ,  upload.single('voice')  , sendVoiceMessage);

module.exports = router;