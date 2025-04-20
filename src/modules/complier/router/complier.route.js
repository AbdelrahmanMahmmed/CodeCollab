const express = require('express');
const router = express.Router();


const { ProtectedRoters } = require('../../auth/controller/auth.controller');

const {
    getGroupCode,
    saveGroupCode,
    runCode
} = require('../controller/complier.controller');

router
    .route('/:groupId/code')
        .get(ProtectedRoters, getGroupCode)
        .post(ProtectedRoters, saveGroupCode);


router
    .route('/:groupId/run')
        .post(ProtectedRoters, runCode);


module.exports = router;
