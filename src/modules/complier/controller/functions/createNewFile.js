const { Compiler, Group, asyncHandler, ApiError } = require('../complier.dependencies');
const Version = require('../../../versionsCode/model/version.model')
const generateIdCommit = require('../../../../util/generateIdCommit');
const validateFileExtensionMatchesLanguage = require('../../../../util/extensionToLanguageId');

/**
 * @desc    Create a new file inside a group
 * @route   POST /compiler/:groupId/file
 * @access  Private
 */
const createNewFile = asyncHandler(async (req, res, next) => {
    const groupId = req.params.groupId;
    const { fileName, language_id } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return next(new ApiError('Group not found', 404));

    const existingFile = await Compiler.findOne({ fileName, group: groupId });
    if (existingFile) return next(new ApiError('File with the same name already exists', 400));

    try {
        validateFileExtensionMatchesLanguage(fileName, language_id);
    } catch (err) {
        return next(new ApiError(err.message, 400));
    }

    const newFile = new Compiler({
        fileName,
        group: groupId,
        language_id,
        createdBy: req.user._id,
    });

    const generateIdcommit = generateIdCommit();

    const version = new Version({
        file: newFile._id,
        versions: [
            {
                IdCommit: generateIdcommit,
                code: '',
                createdAt: new Date(),
                createdBy: req.user._id,
            }
        ]
    });

    await newFile.save();
    await version.save();
    
    res.status(201).json({
        status: 'success',
        message: 'New file created successfully',
        file: newFile,
    });
});

module.exports = createNewFile;