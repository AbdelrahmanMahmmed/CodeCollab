const {validatorsMiddleware,body} = require('../ComplierDependencies');

const runCodeValidator = [

    body('stdin')
        .optional()
        .isString()
        .withMessage('stdin must be a valid string if provided'),
    
    body('fileId')
        .notEmpty()
        .withMessage('File ID is required')
        .isMongoId()
        .withMessage('File ID must be a valid MongoDB ObjectId'),

    validatorsMiddleware,
];

module.exports = runCodeValidator;