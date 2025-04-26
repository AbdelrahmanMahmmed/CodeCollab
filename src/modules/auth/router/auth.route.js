const express = require('express');
const router = express.Router();

const AuthValidator= require('../validator/auth.validator');

const authController = require('../../auth/controller/auth.controller');

router.post('/register', AuthValidator.RegisterUserValidator, authController.register);
router.post('/login', 
    authController.middlewareFunctions.checkVerification, 
    AuthValidator.LoginUserValidator, 
    authController.login
);

router.post('/verify/user', AuthValidator.VerifyUserValidator, authController.verifyUser.Verifyuser);
router.post('/verify/code', authController.verifyUser.verifyCode);

router
    .route('/forget-password')
    .post(    
        authController.middlewareFunctions.checkVerification, 
        authController.forgotpassword.ForgetPassword
    );

router
    .route('/verify/password-reset-code')
    .post(authController.forgotpassword.verifycode);
router
    .route('/reset-password')
    .post(authController.forgotpassword.Resetpassword);

module.exports = router;