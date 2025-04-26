const { Compiler, asyncHandler, ApiError } = require('../complier.dependencies');
const Version = require('../../../versionsCode/model/version.model');
const generateIdCommit = require('../../../../util/generateIdCommit');
const encrypted = require('../../../../util/en-de-text.js/encrypted');
const Group = require('../../../groups/model/group.model')
const SECRET = process.env.CODE_SECRET;

const updateCodeFile = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const fileId = req.params.fileId;

    const file = await Compiler.findById(fileId);
    if (!file) return next(new ApiError('File not found', 404));

    const group = await Group.findById(file.group);
    if (!group) return next(new ApiError('Group not found', 404));


    const isAllowed = group.members.some(memberId => memberId.equals(req.user._id))
        || group.admin.equals(req.user._id);

    if (!isAllowed) {
        return next(new ApiError('You must be a member or the admin of the group to edit this file', 403));
    }

    
    if (code) {
        file.setCode(code, SECRET);
    }

    await file.save();

    let version = await Version.findOne({ file: file._id });
    const encryptedText = encrypted(code, SECRET);
    if (!version) {
        const generateIdcommit = generateIdCommit();

        version = new Version({
            file: fileId,
            versions: [
                {
                    IdCommit: generateIdcommit,
                    code: encryptedText,
                    createdAt: new Date(),
                    createdBy: req.user._id,
                }
            ]
        });

        await version.save();
    }

    version.versions.push({
        IdCommit: generateIdCommit(),
        code: encryptedText,
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