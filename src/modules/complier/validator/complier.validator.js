const createFileValidator = require('./handlers/createFileValidator');
const RunCodeVaild = require('./handlers/runCodeValidator');
const updateFileValidator = require('./handlers/updateFileValidator');
const deleteFileValidator = require('./handlers/deleteFileValidator');
const getFileValidator = require('./handlers/getFileValidator');
const updateFileNameVaild = require('./handlers/updateFileNamevaildation');
module.exports = {
    createFileValidator,
    RunCodeVaild,
    updateFileValidator,
    updateFileNameVaild,
    deleteFileValidator,
    getFileValidator
};