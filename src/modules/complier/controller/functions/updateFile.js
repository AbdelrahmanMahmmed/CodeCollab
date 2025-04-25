const { Compiler, asyncHandler, ApiError } = require('../complier.dependencies');
const SECRET = process.env.CODE_SECRET;

/**
 * @desc    Update the content or metadata of a file
 * @route   PATCH /compiler/file/:fileId
 * @access  Private
 */
const updateCodeFile = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const fileId = req.params.fileId;

    const file = await Compiler.findById(fileId);
    if (!file) return next(new ApiError('File not found', 404));

    if (code) file.setCode(code, SECRET); 

    await file.save();

    res.status(200).json({
        status: 'success',
        message: 'File updated successfully',
    });
});

module.exports = updateCodeFile;