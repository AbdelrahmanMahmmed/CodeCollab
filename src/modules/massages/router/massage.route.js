const express = require('express');
const router = express.Router();

const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const uploadVoice = require('../../../util/uploadVoice');
const { upload } = require('../../../util/UploadImage');

const massageController = require('../controller/massage.controller');

router.use(middlewareFunctions.ProtectedRoters);


router.get('/:groupId/messages', massageController.getGroupMessages);

router.post('/:groupId/message',  massageController.sendMassages);

router.delete('/:groupId/message/:messageId',  massageController.deleteMassage);

router.post('/:groupId/voice', uploadVoice.single('voice')  , massageController.sendVoiceMassage);

router.post('/:groupId/image',upload.single('image') , massageController.SendImage);

module.exports = router;