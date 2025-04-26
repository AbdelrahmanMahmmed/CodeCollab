const { ApiError, Friend, User, asyncHandler ,getIO} = require('../friends.dependencies');
const { uploadImage } = require('../../../../util/UploadImage');
const encryptedContented = require('../../../../util/en-de-text.js/encrypted');
const SECRET = process.env.SECRET_KEY;

/**
 * @desc    Send a message with image to a friend
 * @route   POST /api/v1/friends/:handle/messages/image
 * @access  Private
 */
const sendImageMessage = asyncHandler(async (req, res, next) => {
    const receiverHandle = '@' + req.params.handle;
    const userId = req.user._id;

    if (!req.file) {
        return next(new ApiError("Image is required", 400));
    }

    const receiver = await User.findOne({ handle: receiverHandle });
    if (!receiver) return next(new ApiError("User not found with this handle", 404));

    const friendship = await Friend.findOne({
        $or: [
            { requester: userId, recipient: receiver._id, status: 'Accepted' },
            { requester: receiver._id, recipient: userId, status: 'Accepted' }
        ]
    });

    if (!friendship) return next(new ApiError("Friendship not found", 404));

    let imageUrl = '';
    const result = await uploadImage(req.file);
    imageUrl = result.secure_url;

    const encryptedContent = encryptedContented(imageUrl, SECRET);

    const newMessage = {
        sender: userId,
        message: encryptedContent,
        messageType: 'image',
        createdAt: new Date()
    };

    friendship.massages.push(newMessage);
    await friendship.save();

    const io = getIO();
    io.to(receiver._id.toString()).emit("friend-new-image-message", {
        from: { id: userId, name: req.user.name, avatar: req.user.avatar },
        to: receiver._id,
        imageUrl,
        createdAt: new Date()
    });

    res.status(201).json({ message: "Image sent successfully" });
});

module.exports = sendImageMessage;
