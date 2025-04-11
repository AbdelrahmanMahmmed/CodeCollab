const express = require('express');
const router = express.Router();

const {
    RegisterUserValidator,
    LoginUserValidator,
    VerifyUserValidator
} = require('../validator/auth.validator');


const {
    Register,
    Login,
    VerifyUser,
    verifyCode,
    checkVerification,
    ForgetPassword,
    verifycode,
    Resetpassword
} = require('../../auth/controller/auth.controller');


router.post('/register', RegisterUserValidator, Register);
router.post('/login', checkVerification, LoginUserValidator, Login);


router.post('/verify/user', VerifyUserValidator, VerifyUser);
router.post('/verify/code', verifyCode);


router
    .route('/forget-password')
    .post(checkVerification, ForgetPassword);
router
    .route('/verify/password-reset-code')
    .post(verifycode);
router
    .route('/reset-password')
    .post(Resetpassword);

module.exports = router;