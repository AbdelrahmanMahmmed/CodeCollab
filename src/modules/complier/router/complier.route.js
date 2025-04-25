const express = require('express');
const router = express.Router();

const { middlewareFunctions } = require('../../auth/controller/auth.controller');
const ComplierVaildation = require('../../complier/validator/complier.validator');
const compilerController = require('../controller/complier.controller');

router.use(middlewareFunctions.ProtectedRoters);


router
    .route('/:groupId/run')
    .post(ComplierVaildation.RunCodeVaild, compilerController.runCode);

router
    .route('/:groupId/files')
    .get(compilerController.getGroupRootFiles)
    .post(ComplierVaildation.createFileValidator, compilerController.createNewFile);

router
    .route('/file/:fileId')
    .get(ComplierVaildation.getFileValidator, compilerController.getFileDetails)
    .delete(ComplierVaildation.deleteFileValidator, compilerController.deleteFile);

router
    .route('/file/:fileId/updated-code')
    .patch(ComplierVaildation.updateFileValidator, compilerController.updateFile)

module.exports = router;