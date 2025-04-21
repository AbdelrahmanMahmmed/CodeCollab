const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Get all groups that the user is a member of
 * @route   GET /api/v1/group/my
 * @access  Private
 */
const getMyGroups = asyncHandler(async (req, res, next) => {
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

module.exports = getMyGroups;