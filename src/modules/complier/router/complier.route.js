const express = require('express');
const router = express.Router();


const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const ComplierVaildation = require('../../complier/validator/complier.validator');
const compilerController = require('../controller/complier.controller');

router.use(middlewareFunctions.ProtectedRoters);


router
    .route('/:groupId/code')
        .get(ComplierVaildation.getCodeVaild,compilerController.getGroupCode)
        .post(ComplierVaildation.saveGroupCodeVaild,compilerController.saveGroupCode);


router
    .route('/:groupId/run')
        .post(ComplierVaildation.RunCodeVaild,compilerController.runCode);


module.exports = router;
