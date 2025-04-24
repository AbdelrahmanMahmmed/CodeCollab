const {ApiError,User,Friend,getIO,activeUsers,asyncHandler} = require('../friends.dependencies');

/**
 * @desc    Get all friends
 * @route   GET /api/friends
 * @access  Private
 */
const getFriends = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('friends', 'name handle avatar');
    res.status(200).json({ friends: user.friends });
});

/**
 * @desc    Get all friend requests
 * @route   GET /api/friends/requests
 * @access  Private
 */
const getFriendRequests = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('friendRequests', 'name handle avatar');
    res.status(200).json({ requests: user.friendRequests });
});

/**
 * @desc    Get all blocked users
 * @route   GET /api/friends/blocked
 * @access  Private
 */
const getBlockedUsers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('blockedUsers', 'name handle avatar');
    res.status(200).json({ blocked: user.blockedUsers });
});

module.exports = {
    getFriends,
    getFriendRequests,
    getBlockedUsers,
}