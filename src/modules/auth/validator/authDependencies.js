const { body } = require('express-validator');
const validatorsMiddleware = require('../../../middleware/validatormiddleware');
const User = require('../../user/model/user.model')

module.exports = {
    User,
    validatorsMiddleware,
    body
}