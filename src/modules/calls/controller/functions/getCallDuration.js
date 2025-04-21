const { asyncHandler, Group, Call, ApiError, getIO } = require('../call.dependencies');
/**
 * @desc    Get the duration of an ongoing call
 * @route   GET /call/:groupId/duration
 * @access  Private
 */
const getCallDuration = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;

    const call = await Call.findOne({ group: groupId, isActive: true });
    if (!call) return next(new ApiError("No active call", 404));

    const start = new Date(call.createdAt);
    const now = new Date();

    const durationInSeconds = Math.floor((now - start) / 1000);

    const hours = String(Math.floor(durationInSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((durationInSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(durationInSeconds % 60).padStart(2, '0');

    const formattedDuration = `${hours}:${minutes}:${seconds}`;

    res.status(200).json({
        duration: formattedDuration,
    });
});

module.exports = getCallDuration;