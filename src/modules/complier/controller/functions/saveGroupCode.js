const { axios , Compiler , Group, asyncHandler, ApiError, getIO } = require('../complier.dependencies');


const SECRET = process.env.CODE_SECRET;

/**
 * @desc    Save the compiler code for a group
 * @route   POST /compiler/:groupId/code
 * @access  Private
 */
const saveGroupCode = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const groupId = req.params.groupId;

    let compiler = await Compiler.findOne({ group: groupId });

    if (!compiler) {
        compiler = new Compiler({ group: groupId });
    }

    compiler.setCode(code, SECRET);
    await compiler.save();

    const io = getIO();
    io.to(groupId).emit('compiler:update', { code });

    res.status(200).json({ status: 'success', message: 'Code saved' });
});

module.exports = saveGroupCode ;