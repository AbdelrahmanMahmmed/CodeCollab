const { asyncHandler, Group, Call, ApiError, getIO } = require('../call.dependencies');
/**
 * @desc    Start a new call
 * @route   POST /call/:groupId/start
 * @access  Private
 */
const startCall = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.includes(userId) || group.admin.toString() === userId.toString() || group.otherAdmin.includes(userId);
    if (!isMember) return next(new ApiError("You're not a member of this group", 403));

    const existingCall = await Call.findOne({ group: groupId, isActive: true });
    if (existingCall) return next(new ApiError("A call is already active in this group", 400));

    const call = await Call.create({
        group: groupId,
        startedBy: userId,
        participants: [userId]
    });

    const io = getIO();
    io.to(groupId).emit('callStarted', {
        groupId,
        callId: call._id,
        startedBy: userId,
        startedAt: call.createdAt
    });

    res.status(201).json({ status: 'success', data: call });
});

module.exports = startCall;