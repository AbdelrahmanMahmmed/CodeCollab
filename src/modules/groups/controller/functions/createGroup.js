const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Create a new group
 * @route   POST /api/v1/group
 * @access  Private
 */
const createGroup = asyncHandler(async (req, res) => {
    const { name, description, isPrivate } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    const group = new Group({
        name,
        description,
        isPrivate,
        admin: req.user._id,
    });

    user.groups.push(group._id);

    await group.save();
    await user.save();

    res.status(201).json({
        status: 'success',
        data: group,
    });
})

module.exports = createGroup;