const express = require('express');
const router = express.Router();

const UserVaildation = require('../validator/user.validator');

const { middlewareFunctions } = require('../../auth/controller/auth.controller');
const userController = require('../controller/user.controller');


router.get('/@:handle', userController.getUserByHandle);

router.use(middlewareFunctions.ProtectedRoters);

// Protected User Routes
router.get('/profile', userController.getprofile);
router.put('/edit/status', UserVaildation.statusValidator, userController.editStatus);
router.put('/edit/name', UserVaildation.nameValidator, userController.editName);
router.put('/block',userController.bolckUser);
router.put('/unblock',userController.unblockUser);

module.exports = router;