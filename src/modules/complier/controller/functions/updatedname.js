const { Compiler, asyncHandler, ApiError } = require('../complier.dependencies');
const validateFileExtensionMatchesLanguage = require('../../../../util/extensionToLanguageId');

const updateFileName = asyncHandler(async (req, res, next) => {
    const { fileId } = req.params;
    const { fileName } = req.body;
    
    const compiler = await Compiler.findById(fileId);
    if (!compiler) return next(new ApiError('File not found', 404));

    try {
        validateFileExtensionMatchesLanguage(fileName, compiler.language_id);
    } catch (err) {
        return next(new ApiError(err.message, 400));
    }

    compiler.fileName = fileName;
    await compiler.save();

    res.status(200).json({
        status: 'success',
        message: 'File name updated successfully'
    });
});

module.exports = updateFileName;