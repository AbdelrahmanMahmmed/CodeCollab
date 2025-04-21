const { asyncHandler, Group, Call, ApiError, getIO } = require('../call.dependencies');
/**
 * @desc    Get the members of an ongoing call
 * @route   GET /call/:groupId/members
 * @access  Private
 */
const getMembers = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;

    const call = await Call.findOne({ group: groupId, isActive: true })
        .populate('participants', 'name -_id avatar');

    if (!call) {
        return res.status(404).json({ success: false, message: 'No active call found in this group' });
    }

    const NumbersOfMembers = call.participants.length;

    res.status(200).json({
        NumbersOfMembers,
        Members: call.participants
    });
});

module.exports = getMembers;