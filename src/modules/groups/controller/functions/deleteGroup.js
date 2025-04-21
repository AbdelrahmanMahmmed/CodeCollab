const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Delete a group
 * @route   DELETE /api/v1/group/:groupId
 * @access  Private
 */
const deleteGroup = asyncHandler(async (req, res, next) => {
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

module.exports = deleteGroup;