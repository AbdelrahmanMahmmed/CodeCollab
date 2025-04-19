const CryptoJS = require("crypto-js");
const Group = require("../../groups/model/group.model");
const asyncHandler = require('express-async-handler');
const ApiError = require('../../../util/APIError');
const { getIO } = require('../../../config/socket');

/**
 * @desc    Send a message to a group
 * @route   POST /api/v1/group/:groupId/message
 * @access  Private
 */
exports.sendMessage = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const { type, content } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.includes(userId);
    if (!isMember) return next(new ApiError("You are not a member of this group", 403));

    if (type !== 'text' && type !== 'image') {
        return next(new ApiError("Invalid message type", 400));
    }

    let encryptedContent;
    if (type === 'text') {
        try {
            encryptedContent = CryptoJS.AES.encrypt(content, process.env.SECRET_KEY).toString();
        } catch (err) {
            return next(new ApiError("Encryption failed", 500));
        }
    } else {
        encryptedContent = content;
    }

    const newMessage = {
        sender: userId,
        type : 'text',
        content: encryptedContent,
        timestamp: Date.now()
    };

    group.messages.push(newMessage);
    await group.save();

    const io = getIO();

    io.to(groupId.toString()).emit("newMessage", {
        sender: req.user.name,
        type,
        content,
        timestamp: newMessage.timestamp
    });

    res.status(201).json({ message: "Message sent" });
});

/**
 * @desc    Get messages from a group
 * @route   GET /api/v1/group/:groupId/messages
 * @access  Private
 */
exports.getGroupMessages = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId).populate('messages.sender', 'name avatar phone');
    if (!group) return next(new ApiError("Group not found", 404));

    const isMember = group.members.includes(userId) || group.admin.toString() === userId.toString();
    if (!isMember) return next(new ApiError("You are not a member of this group", 403));

    const messages = group.messages.map(msg => {
        const decrypted = msg.type === 'text'
            ? CryptoJS.AES.decrypt(msg.content, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
            : msg.content;

        return {
            sender: msg.sender.name,
            type: msg.type,
            content: decrypted,
            timestamp: msg.timestamp
        };
    });

    res.status(200).json({ messages });
});


/**
 * @desc    Delete a message from a group (by admin or message sender only)
 * @route   DELETE /api/v1/groups/:groupId/messages/:messageId
 * @access  Private
 */


/**
 * @desc    Delete a message from a group
 * @route   DELETE /api/groups/:groupId/message/:messageId
 * @access  Private
 */
exports.deleteMessage = asyncHandler(async (req, res, next) => {
    const { groupId, messageId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    const message = group.messages.id(messageId);
    if (!message) return next(new ApiError("Message not found", 404));

    const isOwner = message.sender.toString() === userId.toString();
    const isAdmin = group.admin.toString() === userId.toString();

    if (!isOwner && !isAdmin) {
        return next(new ApiError("You don't have permission to delete this message", 403));
    }

    group.messages.pull(messageId);
    await group.save();

    const io = getIO();
    io.to(groupId).emit('messageDeleted', { messageId });

    res.status(200).json({ message: "Message deleted successfully" });
});

/**
 * @desc    Send a voice message to a group
 * @route   POST /api/v1/group/:groupId/voice
 * @access  Private
 */
exports.sendVoiceMessage = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError("Group not found", 404));

    if (!req.file) return next(new ApiError("No voice file provided", 400));

    const result = await cloudinary.uploader.upload_stream(
        {
            resource_type: 'auto',
            folder: 'group_voice_messages'
        },
        async (error, result) => {
            if (error) return next(new ApiError("Failed to upload voice", 500));

            const voiceMessage = {
                sender: senderId,
                type: 'voice',
                content: result.secure_url,
                timestamp: Date.now()
            };

            group.messages.push(voiceMessage);
            await group.save();

            const io = getIO();
            io.to(groupId).emit('newMessage', voiceMessage);

            res.status(201).json({ message: "Voice message sent", data: voiceMessage });
        }
    );

    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer).pipe(result);
});
