const {Group,User,asyncHandler,ApiError,uploadImage,getIO} = require('../group.dependencies');

/**
 * @desc    Upload group image
 * @route   POST /api/v1/group/:groupId/image
 * @access  Private
 */
const uploadImageForGroup = asyncHandler(async (req, res, next) => {
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

        const userId = req.user._id.toString();
        const isAdmin = group.admin._id.toString() === userId;
        if (!isAdmin) {
            return next(new ApiError(`You are not allowed to updated image this group`, 400));
        }

        group.image = imageUrl;
        await group.save();
        res.status(200).json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = uploadImageForGroup;