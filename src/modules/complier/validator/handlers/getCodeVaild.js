const { validatorsMiddleware, body } = require('../ComplierDependencies');
const { isNotMongoId } = require('../../../../util/isNotMongoId');

const getCodeVaild = [
    body('groupId')
        .custom(isNotMongoId)
        .withMessage('groupId must NOT be a valid MongoId'),
    validatorsMiddleware,
];

module.exports = getCodeVaild;
