const axios = require('axios');
const Compiler = require('../model/complier.model');
const Group = require('../../groups/model/group.model');
const asyncHandler = require('express-async-handler');
const ApiError = require('../../../util/APIError');
const { getIO } = require('../../../config/socket');

const SECRET = process.env.CODE_SECRET;

/**
 * @desc    Set the compiler code for a group
 * @route   GET /compiler/:groupId/code
 * @access  Private
 */
exports.getGroupCode = asyncHandler(async (req, res, next) => {
    const groupId = req.params.groupId;
    const compiler = await Compiler.findOne({ group: groupId });

    if (!compiler) return next(new ApiError('Compiler code not found for this group', 404));

    const code = compiler.getCode(SECRET);

    res.status(200).json({ status: 'success', code });
});

/**
 * @desc    Save the compiler code for a group
 * @route   POST /compiler/:groupId/code
 * @access  Private
 */
exports.saveGroupCode = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const groupId = req.params.groupId;

    let compiler = await Compiler.findOne({ group: groupId });

    if (!compiler) {
        compiler = new Compiler({ group: groupId });
    }

    compiler.setCode(code, SECRET);
    await compiler.save();

    const io = getIO();
    io.to(groupId).emit('compiler:update', { code });

    res.status(200).json({ status: 'success', message: 'Code saved' });
});

/**
 * @desc    Run the compiler code for a group
 * @route   POST /compiler/:groupId/run
 * @access  Private
 */
exports.runCode = asyncHandler(async (req, res, next) => {
    const { language_id, stdin } = req.body;
    const { groupId } = req.params;

    console.log(`Request received for group: ${groupId}`);

    const compiler = await Compiler.findOne({ group: groupId });
    console.log("Compiler found:", compiler);

    if (!compiler) return next(new ApiError('Compiler code not found for this group', 404));

    const code = compiler.getCode(process.env.CODE_SECRET);
    const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
        source_code: code,
        language_id,
        stdin,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': process.env.RAPID_HOST_KEY
        }
    });

    const token = response.data.token;

    setTimeout(async () => {
        const result = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.RAPID_HOST_KEY
            }
        });

        res.status(200).json({ status: 'success', result: result.data });
    }, 2000);
});
