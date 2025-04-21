const { axios , Compiler , asyncHandler, ApiError } = require('../complier.dependencies');

const SECRET = process.env.CODE_SECRET;

/**
 * @desc    Run the compiler code for a group
 * @route   POST /compiler/:groupId/run
 * @access  Private
 */
const runCode = asyncHandler(async (req, res, next) => {
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

module.exports = runCode;