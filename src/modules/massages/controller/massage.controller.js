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
        type,
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
