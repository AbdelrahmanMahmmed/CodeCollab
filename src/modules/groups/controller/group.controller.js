const Group = require('../model/group.model');
const User = require('../../user/model/user.model');
const asyncHandler = require('express-async-handler')
const ApiError = require('../../../util/APIError');
const { uploadImage } = require('../../../util/UploadImage');

/**
 * @desc    Create a new group
 * @route   POST /api/v1/group
 * @access  Private
 */
exports.createGroup = asyncHandler(async (req, res) => {
    const { name, description, isPrivate } = req.body;

    const group = new Group({
        name,
        description,
        isPrivate,
        admin: req.user._id,
    });

    await group.save();

    res.status(201).json({
        status: 'success',
        data: group,
    });
})

/**
 * @desc    Get groups public or I in this Group
 * @route   GET /api/v1/group/:groupId
 * @access  Private
 */
exports.getGroup = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Update a group
 * @route   PUT /api/v1/group/:groupId
 * @access  Private
 */
exports.updateGroup = asyncHandler(async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(`No user found with this id ${id}`, 404));
    }

    const group = await Group.findById(req.params.groupId);
    if (!group) {
        return next(new ApiError(`No group found with this id ${req.params.groupId}`, 404));
    }

    if (group.admin.toString() !== id.toString()) {
        return next(new ApiError(`Only the group admin can update the group`, 403));
    }

    const { name, description } = req.body;
    if (!name && !description) {
        return next(new ApiError(`Please provide a name or description to update`, 400));
    }

    if (name) group.name = name;
    if (description) group.description = description;

    await group.save();

    res.status(200).json({
        status: 'success',
    });
});

/**
 * @desc    Invite a user to join a private group (admin sends invitation)
 * @route   POST /api/v1/group/:groupId/invite
 * @access  Private
 */
exports.inviteMember = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const { groupId } = req.params;
    const { inviteUserId } = req.body;

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

    const userToInvite = await User.findById(inviteUserId);
    if (!userToInvite) {
        return next(new ApiError(`No user found with this id ${inviteUserId}`, 404));
    }

    if (group.members.includes(inviteUserId)) {
        return next(new ApiError(`User is already a member of the group`, 400));
    }

    if (group.joinRequests.includes(inviteUserId)) {
        return next(new ApiError(`User has already been invited`, 400));
    }

    if (!userToInvite.requestsGroup) {
        userToInvite.requestsGroup = [];
    }

    group.joinRequests.push(inviteUserId);
    userToInvite.requestsGroup.push(groupId);

    await group.save();
    await userToInvite.save();

    res.status(200).json({
        status: 'success',
        message: `Invitation sent to user with id ${inviteUserId}`,
    });
});

/**
 * @desc    Accept a group join invitation (user accepts invitation)
 * @route   POST /api/v1/group/:groupId/accept-invitation
 * @access  Private
 */
exports.acceptInvitation = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Reject a group join invitation (user rejects invitation)
 * @route   POST /api/v1/group/:groupId/reject-invitation
 * @access  Private
 */
exports.rejectInvitation = asyncHandler(async (req, res, next) => {
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

    group.joinRequests = group.joinRequests.filter(user => user.toString() !== id);

    await group.save();

    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(`No user found with this id ${id}`, 404));
    }

    user.groups = user.groups.filter(group => group.toString() !== groupId);
    user.requestsGroup = user.requestsGroup.filter(group => group.toString() !== groupId);
    await user.save();

    res.status(200).json({
        status: 'success',
        message: `User with id ${id} has been removed from join requests`,
    });
});

/**
 * @desc    leave a user from a group (admin blocks user)
 * @route   POST /api/v1/group/:groupId/leave
 * @access  Private
 */
exports.leaveGroup = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    List all members of a group
 * @route   GET /api/v1/group/:groupId/members
 * @access  Private
 */
exports.listGroupMembers = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const { id } = req.user;

    const group = await Group.findById(groupId)
        .populate('members', 'name email')
        .populate('admin', 'name email');

    if (!group) {
        return next(new ApiError(`No group found with this id ${groupId}`, 404));
    }

    const isAdmin = group.admin.toString() === id;

    // if (!isAdmin && !group.members.some(member => member._id.toString() === id)) {
    //     return next(new ApiError(`You are not authorized to view this group members`, 403));
    // }

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

/**
 * @desc    Upload group image
 * @route   POST /api/v1/group/:groupId/image
 * @access  Private
 */
exports.uploadImageForGroup = asyncHandler(async (req, res, next) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await uploadImage(req.file);
            imageUrl = result.secure_url;
        }
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        group.image = imageUrl;
        await group.save();
        res.status(200).json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @desc    Get all public groups
 * @route   GET /api/v1/group/public
 * @access  Public
 */
exports.getPublicGroups = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const groups = await Group.find({ isPrivate: false })
        .skip(skip)
        .limit(limit)
        .select('-_id -__v -createdAt -updatedAt')
        .populate('members', 'name email')
        .populate('admin', 'name email');

    const totalGroups = await Group.countDocuments({ isPrivate: false });

    res.status(200).json({
        totalGroups,
        totalPages: Math.ceil(totalGroups / limit),
        currentPage: parseInt(page),
        groups,
    });
});

/**
 * @desc    Get all groups that the user is a member of
 * @route   GET /api/v1/group/my
 * @access  Private
 */
exports.getMyGroups = asyncHandler(async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findById(id).populate({
        path: 'groups',
        select: '-_id name description image isPrivate'
    });

    if (!user) {
        return next(new ApiError(`No user found with this id ${id}`, 404));
    }

    res.status(200).json({
        count: user.groups.length,
        groups: user.groups
    });
});

/**
 * @desc    Delete a group
 * @route   DELETE /api/v1/group/:groupId
 * @access  Private
 */
exports.deleteGroup = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        return next(new ApiError(`No group found with this id ${groupId}`, 404));
    }

    if (group.admin.toString() !== id) {
        return next(new ApiError(`You are not authorized to delete this group`, 403));
    }

    await Group.findByIdAndDelete(groupId);

    await User.updateMany(
        { groups: groupId },
        { $pull: { groups: groupId } }
    );

    res.status(200).json({
        status: 'success',
        message: `Group with id ${groupId} has been deleted`,
    });
});

/**
 * @desc    Remove a member from a group (admin removes member)
 * @route   DELETE /api/v1/group/:groupId/remove-member/:userId
 * @access  Private
 */
exports.removeMember = asyncHandler(async (req, res, next) => {
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
