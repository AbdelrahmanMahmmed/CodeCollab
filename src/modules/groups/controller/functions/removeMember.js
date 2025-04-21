const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Remove a member from a group (admin removes member)
 * @route   DELETE /api/v1/group/:groupId/remove-member/:userId
 * @access  Private
 */
const removeMember = asyncHandler(async (req, res, next) => {
    const { id: adminId } = req.user;
    const { groupId, userId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        return next(new ApiError(`No group found with this id ${groupId}`, 404));
    }

    if (group.admin.toString() !== adminId) {
        return next(new ApiError(`You are not authorized to remove members from this group`, 403));
    }

    if (!group.members.includes(userId)) {
        return next(new ApiError(`User is not a member of this group`, 400));
    }

    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();

    const user = await User.findById(userId);
    if (user) {
        user.groups = user.groups.filter(gId => gId.toString() !== groupId);
        await user.save();
    }

    res.status(200).json({
        status: 'success',
        message: `User with id ${userId} has been removed from the group`,
    });
});

module.exports = removeMember;