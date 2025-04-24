const { ApiError, Group, asyncHandler, getIO } = require('../massages.dependencies');
const { uploadImage } = require('../../../../util/UploadImage');
const encryptedContented = require('../../../../util/encrypted');

/**
 * @desc    Send a message with image to a group
 * @route   POST /api/v1/groups/:groupId/messages/image
 * @access  Private
 */
const sendImageMessageToGroup = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    if (!req.file) {
        return next(new ApiError("Image is required", 400));
    }

    const group = await Group.findById(groupId).populate('members', 'name avatar');
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.some(member => member._id.toString() === userId.toString());
    const isAdmin = group.admin.toString() === userId.toString();
    
    if (!isMember && !isAdmin) {
        return next(new ApiError("You are not a member of this group", 403));
    }

    let imageUrl = '';
    const result = await uploadImage(req.file);
    imageUrl = result.secure_url;


    const encryptedContent = encryptedContented(imageUrl, 'image');
    
    const newMessage = {
        sender: userId,
        content: encryptedContent,
        type: 'image',
        timestamp: new Date()
    };

    group.messages.push(newMessage);
    await group.save();

    const io = getIO();
    group.members.forEach(member => {
        if (member._id.toString() !== userId.toString()) {
            io.to(member._id.toString()).emit("group-new-image-message", {
                from: { id: userId, name: req.user.name, avatar: req.user.avatar },
                groupId: groupId,
                imageUrl,
                createdAt: new Date()
            });
        }
    });

    res.status(201).json({ message: "Image sent successfully" });
});

module.exports = sendImageMessageToGroup;