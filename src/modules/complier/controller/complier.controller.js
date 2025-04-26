const getGroupRootFiles = require('./functions/getGroupRootFiles');
const createNewFile = require('./functions/createNewFile');
const getFileDetails = require('./functions/getFileDetails');
const updateFile = require('./functions/updateFile');
const updateFileName = require('./functions/updatedname');
const deleteFile = require('./functions/deleteFile');
const runCode = require('./functions/runCode');
module.exports = {
    getGroupRootFiles,
    createNewFile,
    getFileDetails,
    updateFile,
    updateFileName,
    deleteFile,
    runCode
}