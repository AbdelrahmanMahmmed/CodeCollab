const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Create a new group
 * @route   POST /api/v1/group
 * @access  Private
 */
const createGroup = asyncHandler(async (req, res) => {
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

module.exports = createGroup;