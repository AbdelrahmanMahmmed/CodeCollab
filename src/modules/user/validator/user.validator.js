const { body } = require('express-validator');
const validatorsMiddleware = require('../../../middleware/validatormiddleware');
const User = require('../model/user.model')

exports.statusValidator = [
    body('statusMessage')
        .notEmpty()
        .withMessage('Status is required')
        .isLength({ min: 3 })
        .withMessage('Status must be at least 3 characters long')
        .trim()
        .escape(),
    validatorsMiddleware
]

exports.nameValidator = [
    body('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 2 })
        .withMessage('name must be at least 2 characters long')
        .trim()
        .escape(),
    validatorsMiddleware
]
