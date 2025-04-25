const { Compiler, asyncHandler, ApiError } = require('../complier.dependencies');
const User = require('../../../user/model/user.model');

/**
 * @desc    Delete a specific file from the group
 * @route   DELETE /compiler/file/:fileId
 * @access  Private
 */
const deleteFile = asyncHandler(async (req, res, next) => {
    const fileId = req.params.fileId;

    const file = await Compiler.findById(fileId);
    if (!file) return next(new ApiError('File not found', 404));

    const user = await User.findById(req.user._id);

    if (file.createdBy.toString() !== user._id.toString()) return next(new ApiError('You are not allowed to delete this file', 403));
    
    await Compiler.deleteOne({ _id: fileId });

    res.status(200).json({
        status: 'success',
        message: 'File deleted successfully',
    });
});

module.exports = deleteFile;