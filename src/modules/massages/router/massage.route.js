const express = require('express');
const router = express.Router();

const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const upload = require('../../../util/uploadVoice');

const massageController = require('../controller/massage.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.get('/:groupId/messages', massageController.getGroupMessages);

router.post('/:groupId/message',  massageController.sendMassages);

router.delete('/:groupId/message/:messageId',  massageController.deleteMassage);

router.post('/:groupId/voice',  upload.single('voice')  , massageController.sendVoiceMassage);

module.exports = router;