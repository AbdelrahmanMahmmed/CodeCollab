const { Compiler, asyncHandler, ApiError } = require('../complier.dependencies');
const Version = require('../../../versionsCode/model/version.model');
const generateIdCommit = require('../../../../util/generateIdCommit');
const crypto = require('crypto');

const SECRET = process.env.CODE_SECRET;

const updateCodeFile = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const fileId = req.params.fileId;

    const file = await Compiler.findById(fileId);
    if (!file) return next(new ApiError('File not found', 404));

    if (code) {
        file.setCode(code, SECRET);
    }

    await file.save();

    let version = await Version.findOne({ file: file._id });

    const encryptedCode = crypto
        .createHmac('sha256', SECRET)
        .update(code || '')
        .digest('hex');
    
    if (!version) {
        const generateIdcommit = generateIdCommit();

        version = new Version({
            file: fileId,
            versions: [
                {
                    IdCommit: generateIdcommit,
                    code,
                    createdAt: new Date(),
                    createdBy: req.user._id,
                }
            ]
        });

        await version.save();
    }

    version.versions.push({
        IdCommit: generateIdCommit(),
        code,
        createdAt: new Date(),
        createdBy: req.user._id,
    });

    await version.save();

    res.status(200).json({
        status: 'success',
        message: 'File updated and new version added successfully',
    });
});

module.exports = updateCodeFile;