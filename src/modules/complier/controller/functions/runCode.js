const { axios, Compiler, asyncHandler, ApiError } = require('../complier.dependencies');
const SECRET = process.env.CODE_SECRET;

/**
 * @desc    Run the compiler code for a group
 * @route   POST /compiler/:groupId/run
 * @access  Private
 */
const runCode = asyncHandler(async (req, res, next) => {
    const { stdin, fileId } = req.body;
    const { groupId } = req.params;

    const compiler = await Compiler.findOne({ group: groupId });
    if (!compiler) {
        return next(new ApiError('Compiler code not found for this group', 404));
    }

    const file = compiler.files.id(fileId);
    if (!file) {
        return next(new ApiError('File not found', 404));
    }

    const code = file.getCode(SECRET);

    try {
        const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
            source_code: code,
            language_id : compiler.language_id,
            stdin,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.RAPID_HOST_KEY,
            }
        });

        const token = response.data.token;

        setTimeout(async () => {
            try {
                const result = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                        'X-RapidAPI-Host': process.env.RAPID_HOST_KEY,
                    }
                });

                res.status(200).json({ status: 'success', result: result.data });
            } catch (error) {
                next(new ApiError('Failed to get result from Judge0 API', 500));
            }
        }, 2000);
    } catch (error) {
        next(new ApiError('Failed to submit code to Judge0 API', 500));
    }
});

module.exports = runCode;