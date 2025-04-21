const express = require('express');
const router = express.Router();


const { middlewareFunctions } = require('../../auth/controller/auth.controller');

const {
    getGroupCode,
    saveGroupCode,
    runCode
} = require('../controller/complier.controller');

router.use(middlewareFunctions.ProtectedRoters);


router
    .route('/:groupId/code')
        .get(getGroupCode)
        .post(saveGroupCode);


router
    .route('/:groupId/run')
        .post(runCode);


module.exports = router;
