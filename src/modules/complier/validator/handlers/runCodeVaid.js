const { validatorsMiddleware, body } = require('../ComplierDependencies');
const isNotMongoId = require('../../../../util/isNotMongoId');
const supportedLanguageIds = require('../../../../util/supportedLanguageIds');

const runCodeVaild = [
    body('groupId')
        .custom(isNotMongoId)
        .withMessage('groupId must NOT be a valid MongoId'),

    body('language_id')
        .notEmpty()
        .withMessage('language_id is required')
        .isInt()
        .withMessage('language_id must be an integer')
        .isIn(supportedLanguageIds)
        .withMessage('Unsupported language_id. Please select a valid programming language.'),

    validatorsMiddleware,
];

module.exports = runCodeVaild;