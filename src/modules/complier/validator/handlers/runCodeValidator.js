const {validatorsMiddleware,body} = require('../ComplierDependencies');

const runCodeValidator = [

    body('stdin')
        .optional()
        .isString()
        .withMessage('stdin must be a valid string if provided'),

    validatorsMiddleware,
];

module.exports = runCodeValidator;