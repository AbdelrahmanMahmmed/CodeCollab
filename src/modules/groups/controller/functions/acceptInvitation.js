const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Accept a group join invitation (user accepts invitation)
 * @route   POST /api/v1/group/:groupId/accept-invitation
 * @access  Private
 */
const acceptInvitation = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        return next(new ApiError(`No group found with this id ${groupId}`, 404));
    }

    if (!group.isPrivate) {
        return next(new ApiError(`Group is not private`, 400));
    }

    if (!group.joinRequests.includes(id)) {
        return next(new ApiError(`You have not requested to join this group`, 400));
    }

    group.members.push(id);
    group.joinRequests = group.joinRequests.filter(user => user.toString() !== id);

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(`No user found with this id ${id}`, 404));
    }

    user.requestsGroup = user.requestsGroup.filter(group => group.toString() !== groupId);
    user.groups.push(groupId);
    await user.save();

    await group.save();

    res.status(200).json({
        status: 'success',
        message: `User with id ${id} has been added to the group`,
    });
});

module.exports = acceptInvitation;