const express = require('express');
const router = express.Router();

const { 
    statusValidator,
    nameValidator,
} = require('../validator/user.validator');

const { ProtectedRoters, allwedTo } = require('../../auth/controller/auth.controller');

const {
    profile,
    editName,
    editStatus,
    Blocked,
    UnBlocked,
    getUserByHandle
} = require('../controller/user.controller');


router.get('/profile', 
    ProtectedRoters,
    profile);

router.put('/edit/status', 
    ProtectedRoters,
    statusValidator,
    editStatus);

router.put('/edit/name', 
    ProtectedRoters,
    nameValidator,
    editName);

router.put('/block', 
    ProtectedRoters,
    Blocked);

router.put('/unblock', 
    ProtectedRoters,
    UnBlocked);

router.get('/@:handle',
    getUserByHandle);
    
module.exports = router;