const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    leave a user from a group (admin blocks user)
 * @route   POST /api/v1/group/:groupId/leave
 * @access  Private
 */
const leaveGroup = asyncHandler(async (req, res, next) => {
    const userId = req.user._id.toString();
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        return next(new ApiError(`No group found with this id ${groupId}`, 404));
    }

    const isMember = group.members.some(member => member.toString() === userId);
    if (!isMember) {
        return next(new ApiError(`You are not a member of this group`, 400));
    }

    group.members = group.members.filter(member => member.toString() !== userId);

    if (!group.leavedUsers) {
        group.leavedUsers = [];
    }

    group.leavedUsers = group.leavedUsers.filter(u => u.user.toString() !== userId);

    group.leavedUsers.push({
        user: req.user._id,
        leftAt: Date.now()
    });

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(`No user found with this id ${userId}`, 404));
    }
    user.groups = user.groups.filter(group => group.toString() !== groupId);
    await user.save();

    await group.save();

    res.status(200).json({
        status: 'success',
        message: 'You left the group successfully. You can rejoin after 2 hours.'
    });
});

module.exports = leaveGroup;