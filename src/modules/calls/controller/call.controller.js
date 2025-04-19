const asyncHandler = require('express-async-handler');
const Group = require('../../groups/model/group.model');
const Call = require('../models/call.model');
const ApiError = require('../../../util/APIError');
const { getIO } = require('../../../config/socket');

/**
 * @desc    Start a new call
 * @route   POST /call/:groupId/start
 * @access  Private
 */
exports.startCall = asyncHandler(async (req, res, next) => {
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


/**
 * @desc    End an ongoing call
 * @route   POST //call/:groupId/end
 * @access  Private
 */
exports.joinCall = asyncHandler(async (req, res, next) => {
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


/**
 * @desc    Leave an ongoing call
 * @route   POST /call/:groupId/leave
 * @access  Private
 */
exports.leaveCall = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Get the duration of an ongoing call
 * @route   GET /call/:groupId/duration
 * @access  Private
 */
exports.getCallDuration = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Get the members of an ongoing call
 * @route   GET /call/:groupId/members
 * @access  Private
 */
exports.getMembers = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    End the ongoing call in a group
 * @route   POST /call/:groupId/end
 * @access  Private
 */
exports.endCall = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Get all calls in a group
 * @route   GET /call/:groupId/calls
 * @access  Private
 */
exports.getCalls = asyncHandler(async (req, res, next) => {
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