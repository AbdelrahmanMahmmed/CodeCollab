const {validatorsMiddleware,body} = require('../ComplierDependencies');
const supportedLanguageIds = require('../../../../util/supportedLanguageIds')

const createFileValidator = [
    body('fileName')
        .notEmpty()
        .withMessage('File name is required')
        .isString()
        .withMessage('File name must be a string')
        .isLength({ min: 1 })
        .withMessage('File name must be at least 1 character long'),
    
    body('language_id')
        .notEmpty()
        .withMessage('Language is required')
        .isInt()
        .withMessage('Language must be a Integer')
        .isIn(supportedLanguageIds) 
        .withMessage('Language must be one of the supported languages'),

    validatorsMiddleware,
];

module.exports = createFileValidator;