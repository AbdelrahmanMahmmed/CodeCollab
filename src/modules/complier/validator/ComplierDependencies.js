const { body , param } = require('express-validator');
const validatorsMiddleware = require('../../../middleware/validatormiddleware');

module.exports = {
    validatorsMiddleware,
    body,
    param
}