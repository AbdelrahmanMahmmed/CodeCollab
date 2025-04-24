const { validatorsMiddleware, body } = require('../CallDependencies');
const isNotMongoId = require('../../../../util/isNotMongoId');

const StartCallInvalid = [
    body('groupId')
        .custom(isNotMongoId)
        .withMessage('groupId must NOT be a valid MongoId'),
    validatorsMiddleware,
];

module.exports = StartCallInvalid;