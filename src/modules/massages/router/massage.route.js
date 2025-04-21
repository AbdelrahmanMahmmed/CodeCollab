const express = require('express');
const router = express.Router();

const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const upload = require('../../../util/uploadVoice');

const {
    sendMessage,
    getGroupMessages,
    deleteMessage,
    sendVoiceMessage
} = require('../controller/massage.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.get('/:groupId/messages', getGroupMessages);

router.post('/:groupId/message',  sendMessage);

router.delete('/:groupId/message/:messageId',  deleteMessage);

router.post('/:groupId/voice',  upload.single('voice')  , sendVoiceMessage);

module.exports = router;