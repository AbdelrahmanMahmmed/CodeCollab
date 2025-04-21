const User = require('../../../user/model/user.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const crypto = require('crypto');
const SendEmail = require('../../../../util/sendEmail');
const ApiError = require('../../../../util/APIError');

/**
 * @desc    Forget password
 * @route   POST /api/v1/auth/forget-password
 * @access  Public
 */
const ForgetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`User not found for ${req.body.email}`, 404));
    }
    const GenerateaCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashResertCode = crypto.
        createHash('sha256')
        .update(GenerateaCode)
        .digest('hex');

    user.passwordResetCode = hashResertCode;
    user.passwordResetExpiret = Date.now() + 10 * 6 * 1000;  // 10 minutes
    user.passwordResetVerifed = false;
    await user.save();

    const resetMessage = `
Hello ${user.name},
    
You have requested to reset your password. Please use the following code to complete the process:
    
Reset Code: ${GenerateaCode}
    
If you did not request this, please ignore this email or contact our support team for assistance.
    
Thank you,
CodeCollab Team
    `;
    try {
        await SendEmail({
            to: user.email,
            subject: 'Password Code From CodeCollab',
            text: resetMessage
        });
    } catch (err) {
        user.passwordResetCode = undefined,
            user.passwordResetExpiret = undefined,
            user.passwordResetVerifed = undefined,
            await user.save();
        return next(new ApiError('Failed to send email, please try again later', 500));
    }
    res.status(200).json({
        message: "Password Code sent successfully"
    });
});

/**
 * @desc    Verify the password reset code
 * @route   POST /api/v1/auth/verify/password-reset-code
 * @access  Public
 */
const verifycode = asyncHandler(async (req, res, next) => {
    const hashResertCode = crypto.
        createHash('sha256')
        .update(req.body.code)
        .digest('hex');
    const user = await User.findOne({
        passwordResetCode: hashResertCode
    });
    if (!user) {
        return next(new ApiError('Invalid or expired reset password code'));
    }
    user.passwordResetVerifed = true;
    await user.save();
    res.status(200).json({
        message: 'Password reset code verified successfully'
    });
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password
 * * @access  Public
 */
const Resetpassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError('There is no user with email ' + req.body.email, 404));
    }
    if (!(user.passwordResetVerifed)) {
        return next(new ApiError('Invalid or expired reset password code', 400));
    }

    user.password = req.body.NewPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpiret = undefined;
    user.passwordResetVerifed = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME
    });

    res.status(200).json({
        message: 'Password has been reset successfully',
        token
    });
});

module.exports = {
    ForgetPassword,
    verifycode,
    Resetpassword 
}