const { body } = require('express-validator');
const validatorsMiddleware = require('../../../../middleware/validatormiddleware');

const statusValidator = [
    body('statusMessage')
        .notEmpty()
        .withMessage('Status is required')
        .isLength({ min: 3 })
        .withMessage('Status must be at least 3 characters long')
        .trim()
        .escape(),
    validatorsMiddleware
]

module.exports = statusValidator;