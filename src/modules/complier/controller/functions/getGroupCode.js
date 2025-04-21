const { Compiler , Group, asyncHandler, ApiError, getIO } = require('../complier.dependencies');

const SECRET = process.env.CODE_SECRET;

/**
 * @desc    Set the compiler code for a group
 * @route   GET /compiler/:groupId/code
 * @access  Private
 */
const getGroupCode = asyncHandler(async (req, res, next) => {
    const groupId = req.params.groupId;
    const compiler = await Compiler.findOne({ group: groupId });

    if (!compiler) return next(new ApiError('Compiler code not found for this group', 404));

    const code = compiler.getCode(SECRET);

    res.status(200).json({ status: 'success', code });
});

module.exports = getGroupCode ;