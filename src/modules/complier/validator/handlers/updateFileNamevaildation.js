const {validatorsMiddleware,body , param} = require('../ComplierDependencies');

const updateFileValidator = [
    param('fileId')
        .notEmpty()
        .withMessage('File ID is required')
        .isMongoId()
        .withMessage('File ID must be a valid MongoDB ObjectId'),

    body('fileName')
        .optional()
        .isString()
        .withMessage('File name must be a string')
        .isLength({ min: 1 })
        .withMessage('File name must be at least 1 character long'),

    validatorsMiddleware,
];

module.exports = updateFileValidator;