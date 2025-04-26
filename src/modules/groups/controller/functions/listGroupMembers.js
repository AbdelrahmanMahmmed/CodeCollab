const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    List all members of a group
 * @route   GET /api/v1/group/:groupId/members
 * @access  Private
 */
const listGroupMembers = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const { id } = req.user;

    const group = await Group.findById(groupId)
        .populate('members', 'name email')
        .populate('admin', 'name email');

    if (!group) {
        return next(new ApiError(`No group found with this id ${groupId}`, 404));
    }

    const userId = req.user._id.toString();
    const isMember = group.members.some(member => member._id.toString() === userId);
    const isAdmin = group.admin._id.toString() === userId;

    if (group.isPrivate && !isMember && !isAdmin) {
        return next(new ApiError(`You are not allowed to access this private group`, 403));
    }

    const membersWithRole = [
        {
            name: group.admin.name,
            email: group.admin.email,
            role: 'Admin',
        },
        ...group.members.map(member => {
            return {
                name: member.name,
                email: member.email,
                role: 'Member',
            };
        }),
    ];

    const memberCount = membersWithRole.length;

    res.status(200).json({
        memberCount,
        members: membersWithRole,
    });
});

module.exports = listGroupMembers;