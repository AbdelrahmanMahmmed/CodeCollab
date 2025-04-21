const { asyncHandler, Group, Call, ApiError, getIO } = require('../call.dependencies');

/**
 * @desc    Get all calls in a group
 * @route   GET /call/:groupId/calls
 * @access  Private
 */
const getCalls = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;

    const calls = await Call.find({ group: groupId, isActive: false })
        .sort({ createdAt: -1 })
        .select('-participants -_id -group -isActive -createdAt -updatedAt -__v')
        .populate('startedBy', 'name -_id')

    res.status(200).json({
        results: calls.length,
        data: calls
    })
})

module.exports  =  getCalls ;