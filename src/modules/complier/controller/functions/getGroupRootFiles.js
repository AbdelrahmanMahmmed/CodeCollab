const { Compiler, Group, asyncHandler, ApiError } = require('../complier.dependencies');

/**
 * @desc    Get all root files and folders for a group
 * @route   GET /compiler/:groupId/files
 * @access  Private
 */

const getGroupRootFiles = asyncHandler(async (req, res, next) => {
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError('Group not found', 404));

    const files = await Compiler.find({ group: groupId});
    res.status(200).json({ status: 'success', files });
});

module.exports = getGroupRootFiles;