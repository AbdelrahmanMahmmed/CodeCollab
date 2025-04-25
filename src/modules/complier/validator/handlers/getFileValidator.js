const {validatorsMiddleware,param} = require('../ComplierDependencies');

const getFileValidator = [
    param('fileId')
        .notEmpty()
        .withMessage('File ID is required')
        .isMongoId()
        .withMessage('File ID must be a valid MongoDB ObjectId'),

    validatorsMiddleware,
];

module.exports = getFileValidator;