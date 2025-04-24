const {User , validatorsMiddleware , body} = require('../authDependencies');
const LoginUserValidator = [
    body("email")
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
    ,
    body("password")
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
    ,
    validatorsMiddleware,
];
module.exports = LoginUserValidator;