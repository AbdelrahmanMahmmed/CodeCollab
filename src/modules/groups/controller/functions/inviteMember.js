// const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

// /**
//  * @desc    Invite multiple users to join a private group (admin sends invitations)
//  * @route   POST /api/v1/group/:groupId/invite
//  * @access  Private
//  */
// const inviteMember = asyncHandler(async (req, res, next) => {
//     const { id } = req.user;
//     const { groupId } = req.params;
//     const { inviteUserIds } = req.body; // Now expecting an array of user IDs

//     if (!Array.isArray(inviteUserIds)) {
//         return next(new ApiError('inviteUserIds must be an array', 400));
//     }

//     const group = await Group.findById(groupId);
//     if (!group) {
//         return next(new ApiError(`No group found with this id ${groupId}`, 404));
//     }

//     if (!group.isPrivate) {
//         return next(new ApiError(`Group is not private, cannot send invitation`, 400));
//     }

//     if (group.admin.toString() !== id) {
//         return next(new ApiError(`You are not authorized to send invites to this group`, 403));
//     }

//     const successfulInvites = [];
//     const failedInvites = [];

//     for (const userId of inviteUserIds) {
//         try {
//             const userToInvite = await User.findById(userId);
//             if (!userToInvite) {
//                 failedInvites.push({ userId, reason: 'User not found' });
//                 continue;
//             }

//             if (group.members.includes(userId)) {
//                 failedInvites.push({ userId, reason: 'Already a member' });
//                 continue;
//             }

//             if (group.joinRequests.includes(userId)) {
//                 failedInvites.push({ userId, reason: 'Already invited' });
//                 continue;
//             }

//             if (!userToInvite.requestsGroup) {
//                 userToInvite.requestsGroup = [];
//             }

//             group.joinRequests.push(userId);
//             userToInvite.requestsGroup.push(groupId);
//             await userToInvite.save();
//             successfulInvites.push(userId);
//         } catch (error) {
//             failedInvites.push({ userId, reason: 'Internal error' });
//         }
//     }

//     if (successfulInvites.length > 0) {
//         await group.save();
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             successfulInvites,
//             failedInvites,
//             totalSuccess: successfulInvites.length,
//             totalFailed: failedInvites.length
//         }
//     });
// });

// module.exports = inviteMember;







const { Group, User, asyncHandler, ApiError } = require('../group.dependencies');

const findGroupOrThrow = async (groupId) => {
    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(`No group found with this id ${groupId}`, 404);
    }
    return group;
};

const checkPermissions = (userId, group) => {
    if (!group.isPrivate) {
        throw new ApiError(`Group is not private, cannot send invitation`, 400);
    }

    if (group.admin.toString() !== userId) {
        throw new ApiError(`You are not authorized to send invites to this group`, 403);
    }
};

const calculateHoursBetween = (date1, date2) => {
    return (date1 - date2) / (1000 * 60 * 60);
};

const validateInvite = (group, userId) => {
    if (group.members.includes(userId)) {
        throw new ApiError('Already a member', 400);
    }

    if (group.joinRequests.includes(userId)) {
        throw new ApiError('Already invited', 400);
    }

    const leavedUser = group.leavedUsers.find(u => u.user.toString() === userId.toString());
    if (leavedUser) {
        const now = new Date();
        const leftAt = new Date(leavedUser.leftAt);
        const diffInHours = calculateHoursBetween(now, leftAt);

        if (diffInHours < 2) {
            throw new ApiError('User left recently, must wait 2 hours', 400);
        }
    }
};

/**
 * @desc    Invite multiple users to join a private group (admin sends invitations)
 * @route   POST /api/v1/group/:groupId/invite
 * @access  Private
 */
const inviteMember = asyncHandler(async (req, res, next) => {
    const { id: userId } = req.user;
    const { groupId } = req.params;
    const { inviteUserIds } = req.body;

    if (!Array.isArray(inviteUserIds)) {
        return next(new ApiError('inviteUserIds must be an array', 400));
    }

    try {
        const group = await findGroupOrThrow(groupId);
        checkPermissions(userId, group);

        const successfulInvites = [];
        const failedInvites = [];

        for (const inviteeId of inviteUserIds) {
            try {
                const userToInvite = await User.findById(inviteeId);
                if (!userToInvite) {
                    failedInvites.push({ userId: inviteeId, reason: 'User not found' });
                    continue;
                }

                validateInvite(group, inviteeId);

                if (!userToInvite.requestsGroup) {
                    userToInvite.requestsGroup = [];
                }

                group.joinRequests.push(inviteeId);
                userToInvite.requestsGroup.push(groupId);
                await userToInvite.save();
                successfulInvites.push(inviteeId);

            } catch (error) {
                failedInvites.push({ userId: inviteeId, reason: error.message || 'Internal error' });
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
    } catch (error) {
        next(error);
    }
});

module.exports = inviteMember;