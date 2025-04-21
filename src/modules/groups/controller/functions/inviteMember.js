const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Invite multiple users to join a private group (admin sends invitations)
 * @route   POST /api/v1/group/:groupId/invite
 * @access  Private
 */
const inviteMember = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const { groupId } = req.params;
    const { inviteUserIds } = req.body; // Now expecting an array of user IDs

    if (!Array.isArray(inviteUserIds)) {
        return next(new ApiError('inviteUserIds must be an array', 400));
    }

    const group = await Group.findById(groupId);
    if (!group) {
        return next(new ApiError(`No group found with this id ${groupId}`, 404));
    }

    if (!group.isPrivate) {
        return next(new ApiError(`Group is not private, cannot send invitation`, 400));
    }

    if (group.admin.toString() !== id) {
        return next(new ApiError(`You are not authorized to send invites to this group`, 403));
    }

    const successfulInvites = [];
    const failedInvites = [];

    for (const userId of inviteUserIds) {
        try {
            const userToInvite = await User.findById(userId);
            if (!userToInvite) {
                failedInvites.push({ userId, reason: 'User not found' });
                continue;
            }

            if (group.members.includes(userId)) {
                failedInvites.push({ userId, reason: 'Already a member' });
                continue;
            }

            if (group.joinRequests.includes(userId)) {
                failedInvites.push({ userId, reason: 'Already invited' });
                continue;
            }

            if (!userToInvite.requestsGroup) {
                userToInvite.requestsGroup = [];
            }

            group.joinRequests.push(userId);
            userToInvite.requestsGroup.push(groupId);
            await userToInvite.save();
            successfulInvites.push(userId);
        } catch (error) {
            failedInvites.push({ userId, reason: 'Internal error' });
        }
    }

    if (successfulInvites.length > 0) {
        await group.save();
    }

    res.status(200).json({
        status: 'success',
        data: {
            successfulInvites,
            failedInvites,
            totalSuccess: successfulInvites.length,
            totalFailed: failedInvites.length
        }
    });
});

module.exports = inviteMember;