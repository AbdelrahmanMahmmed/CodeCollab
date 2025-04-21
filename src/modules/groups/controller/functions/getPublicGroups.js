const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');


/**
 * @desc    Get all public groups
 * @route   GET /api/v1/group/public
 * @access  Public
 */
const getPublicGroups = asyncHandler(async (req, res, next) => {
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

module.exports = getPublicGroups;