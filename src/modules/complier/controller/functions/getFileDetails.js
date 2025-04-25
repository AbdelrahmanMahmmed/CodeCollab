const { Compiler, asyncHandler, ApiError } = require('../complier.dependencies');
const SECRET = process.env.CODE_SECRET;

/**
 * @desc    Fetch a specific file by ID including its code
 * @route   GET /compiler/file/:fileId
 * @access  Private
 */
const getFileDetails = asyncHandler(async (req, res, next) => {
    const fileId = req.params.fileId;

    const file = await Compiler.findById(fileId);
    if (!file) return next(new ApiError('File not found', 404));

    if (file.code === '') {
        res.status(200).json({
            status: 'success',
            file: {
                name: file.name,
                language_id: file.language_id,
                code: '',
            },
        });
    }
    else {
        const code = file.getCode(SECRET);

        res.status(200).json({
            status: 'success',
            file: {
                name: file.name,
                language_id: file.language_id,
                code,
            },
        });
        
    }
});

module.exports = getFileDetails;