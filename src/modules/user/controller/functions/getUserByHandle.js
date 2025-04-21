const {  User,asyncHandler,ApiError} = require('../user.dependencies');

/**
 * @desc    Get user by handle
 * @route   GET /:handle
 * @access  Public
 */
const getUserByHandle = asyncHandler(async (req, res) => {
    const handleParam = '@' + req.params.handle;
    const user = await User.findOne({ handle: handleParam }).select('-_id name avatar handle statusMessage');
    if (!user) {
        return res.status(404).json({ message: 'Handle is Wrong' });
    }
    res.status(200).json({ user });
});

module.exports = getUserByHandle;