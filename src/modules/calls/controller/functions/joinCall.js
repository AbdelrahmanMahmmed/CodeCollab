const { asyncHandler, Group, Call, ApiError, getIO } = require('../call.dependencies');
/**
 * @desc    End an ongoing call
 * @route   POST //call/:groupId/end
 * @access  Private
 */
const joinCall = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.includes(userId) || group.admin.toString() === userId.toString() || group.otherAdmin.includes(userId);
    if (!isMember) return next(new ApiError("You're not a member of this group", 403));

    const call = await Call.findOne({ group: groupId, isActive: true });
    if (!call) return next(new ApiError("No active call found in this group", 404));

    if (!call.participants.includes(userId)) {
        call.participants.push(userId);
        await call.save();
    }

    const io = getIO();
    io.to(groupId).emit('userJoinedCall', {
        userId,
        groupId,
        callId: call._id
    });

    res.status(200).json({ status: 'success', message: 'Joined call successfully' });
});

module.exports = joinCall ;