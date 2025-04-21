const User = require('../../../user/model/user.model');
const asyncHandler = require('express-async-handler')
const crypto = require('crypto');
const SendEmail = require('../../../../util/sendEmail');
const ApiError = require('../../../../util/APIError');

/**
 * @desc    Verify user
 * @route   POST /api/v1/auth/verify/user
 * @access  Public
 */
const Verifyuser = asyncHandler(async (req, res, next) => {
    // const user = req.user._id;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`User not found for ${user.email}`, 404));
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode =
        crypto.
            createHash('sha256')
            .update(generatedCode)
            .digest('hex');

    user.UserResetCode = hashedResetCode;
    user.UserResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetMessage = `
Hello ${user.name},

Welcome to CodeCollab! 👩‍💻👨‍💻

We're excited to have you on board. To activate your account and start collaborating on code in real-time, please verify your email address using the code below:

🔐 Verification Code: ${generatedCode}

If you didn’t sign up for CodeCollab, please disregard this message.

Happy coding!  
– The CodeCollab Team
    `;

    try {
        await SendEmail({
            to: user.email,
            subject: 'CodeCollab Verification Code',
            text: resetMessage
        });
    } catch (err) {
        console.error("Error while sending email:", err);

        user.UserResetCode = undefined;
        user.UserResetExpire = undefined;
        await user.save();

        return next(new ApiError('Failed to send email, please try again later', 500));
    }

    res.status(200).json({
        message: "Verification code sent successfully"
    });
});

/**
 * @desc    Verify the code
 * @route   POST /api/v1/auth/verify/code
 * @access  Public
 */
const verifyCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto.createHash('sha256').update(req.body.code).digest('hex');

    const user = await User.findOne({ UserResetCode: hashedResetCode });

    if (!user || user.UserResetExpire < Date.now()) {
        return next(new ApiError('Invalid or expired verification code', 400));
    }

    user.isVerified = true;
    user.UserResetCode = undefined;
    user.UserResetExpire = undefined;
    await user.save();

    res.status(200).json({
        message: 'Verification code verified successfully'
    });
});

module.exports = {   
    Verifyuser, 
    verifyCode 
};