const express = require('express');
const router = express.Router();

const {
    RegisterUserValidator,
    LoginUserValidator,
    VerifyUserValidator
} = require('../validator/auth.validator');


const authController = require('../../auth/controller/auth.controller');


router.post('/register', RegisterUserValidator, authController.register);
router.post('/login', 
    authController.middlewareFunctions.checkVerification, 
    LoginUserValidator, 
    authController.login
);


router.post('/verify/user', VerifyUserValidator, authController.verifyUser.Verifyuser);
router.post('/verify/code', authController.verifyUser.Verifyuser);


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