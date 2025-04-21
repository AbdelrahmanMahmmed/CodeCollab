const { asyncHandler, Group, Call, ApiError, getIO } = require('../call.dependencies');

/**
 * @desc    End the ongoing call in a group
 * @route   POST /call/:groupId/end
 * @access  Private
 */
const endCall = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const call = await Call.findOne({ group: groupId, isActive: true });

    if (!call) {
        return next(new ApiError("No active call found in this group", 404));
    }

    if (call.startedBy.toString() !== userId.toString()) {
        return next(new ApiError("Only the user who started the call can end it", 403));
    }

    call.isActive = false;
    await call.save();

    const io = getIO();
    io.to(groupId).emit('callEnded', {
        message: 'The call has ended.',
        groupId
    });

    res.status(200).json({
        status: 'success',
        message: 'Call ended successfully',
        endedAt: new Date()
    });
});

module.exports = endCall;