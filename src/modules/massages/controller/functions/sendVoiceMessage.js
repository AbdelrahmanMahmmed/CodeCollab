const {Group,asyncHandler,ApiError,getIO,CryptoJS} = require('../massages.dependencies')

/**
 * @desc    Send a voice message to a group
 * @route   POST /api/v1/group/:groupId/voice
 * @access  Private
 */
const sendVoiceMessage = asyncHandler(async (req, res, next) => {
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

module.exports = sendVoiceMessage ;
