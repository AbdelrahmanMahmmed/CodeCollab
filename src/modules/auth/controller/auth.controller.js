const register = require('./functions/Register');
const login = require('./functions/Login');
const forgotpassword = require('./functions/forgotpassword');
const verifyUser = require('./functions/verifyUser');
const middlewareFunctions = require('./functions/middlewareFunctions');

module.exports  = {
    register,
    login,
    middlewareFunctions,
    verifyUser,
    forgotpassword
}