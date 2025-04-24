const { body } = require('express-validator');
const validatorsMiddleware = require('../../../../middleware/validatormiddleware');

const nameValidator = [
    body('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 2 })
        .withMessage('name must be at least 2 characters long')
    ,
    validatorsMiddleware,
]

module.exports = nameValidator;