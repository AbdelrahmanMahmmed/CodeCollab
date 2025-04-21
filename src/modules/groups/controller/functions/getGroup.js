const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Get groups public or I in this Group
 * @route   GET /api/v1/group/:groupId
 * @access  Private
 */
const getGroup = asyncHandler(async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(`No user found with this id ${id}`, 404));
    }

    const group = await Group.findById(req.params.groupId)
        .populate('members', 'name')
        .populate('admin', 'name')
        .select('-_id -__v -createdAt -updatedAt');

    if (!group) {
        return next(new ApiError(`No group found with this id ${req.params.groupId}`, 404));
    }

    const userId = req.user._id.toString();
    const isMember = group.members.some(member => member._id.toString() === userId);
    const isAdmin = group.admin._id.toString() === userId;

    if (group.isPrivate && !isMember && !isAdmin) {
        return next(new ApiError(`You are not allowed to access this private group`, 403));
    }

    const groupData = {
        _id: group._id,
        name: group.name,
        description: group.description,
        image: group.image,
        isPrivate: group.isPrivate,
        admin: group.admin,
        members: group.members,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
    };

    if (isAdmin) {
        groupData.joinRequests = group.joinRequests;
        groupData.blockedUsers = group.blockedUsers;
    }

    res.status(200).json({
        group: groupData,
        role: isAdmin ? 'admin' : 'member',
    });
});

module.exports = getGroup;