const {User , validatorsMiddleware , body} = require('../authDependencies');
VerifyUserValidator = [
    body("email")
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (email, { req }) => {
            const user = await User.findOne({email});
            if (!user) {
                throw new Error('User not found');
            }
        }),

    validatorsMiddleware,
]
module.exports = VerifyUserValidator;