const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Update a group
 * @route   PUT /api/v1/group/:groupId
 * @access  Private
 */
const updateGroup = asyncHandler(async (req, res, next) => {
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

module.exports = updateGroup;