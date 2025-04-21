const { asyncHandler, Group, Call, ApiError, getIO } = require('../call.dependencies');

/**
 * @desc    Leave an ongoing call
 * @route   POST /call/:groupId/leave
 * @access  Private
 */
const leaveCall = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const call = await Call.findOne({ group: groupId, isActive: true });
    if (!call) return next(new ApiError("No active call found in this group", 404));

    call.participants = call.participants.filter(
        (participant) => participant.toString() !== userId.toString()
    );

    if (call.participants.length === 0) {
        call.isActive = false;
    }

    await call.save();

    const io = getIO();
    io.to(groupId).emit('userLeftCall', {
        userId,
        groupId,
        callId: call._id
    });

    res.status(200).json({ status: 'success', message: 'Left call successfully' });
});

module.exports = leaveCall;