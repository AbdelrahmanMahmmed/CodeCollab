const { Version, asyncHandler, ApiError } = require('../version.dependencies');

/**
 * @desc    Get Version By IdCommit
 * @route   /:idCommit
 * @access  Public
 */
const getVersionByIdCommit = asyncHandler(async (req, res, next) => {
    const { idCommit } = req.params;

    const version = await Version.findOne({ "versions.IdCommit": idCommit });

    if (!version) {
        return next(new ApiError(`No version found with this idCommit: ${idCommit}`, 404));
    }

    const commit = version.versions.find(ver => ver.IdCommit === idCommit);

    if (!commit) {
        return next(new ApiError(`No commit found with this idCommit: ${idCommit}`, 404));
    }

    res.status(200).json(commit);
});

module.exports = getVersionByIdCommit;