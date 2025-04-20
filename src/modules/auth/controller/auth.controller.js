const User = require('../../user/model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const crypto = require('crypto');
const SendEmail = require('../../../util/sendEmail');
const ApiError = require('../../../util/APIError');
const generateProfileImage = require('../../../util/canvasProfile');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.Register = asyncHandler(async (req, res) => {

    const generateUrlavatar = await generateProfileImage(req.body.name);

    const generatedNumber = Math.floor(100 + Math.random() * 900);

    const handle = '@' + req.body.name.toLowerCase().replace(/\s+/g, '') + generatedNumber;

    const user = new User({
        name: req.body.name,
        handle,
        email: req.body.email,
        password: req.body.password,
        avatar : generateUrlavatar,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME,
        sameSite: "Lax"
    });

    res.status(201).json({
        user,
        token,
    });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.Login = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        throw new ApiError('Invalid email or password', 401);
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME,
        sameSite: "Lax"
    });
    res.json({ token });
});

/**
 * @desc    Verify user
 * @route   POST /api/v1/auth/verify/user
 * @access  Public
 */
exports.VerifyUser = asyncHandler(async (req, res, next) => {
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
exports.verifyCode = asyncHandler(async (req, res, next) => {
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


/**
 * @desc    Forget password
 * @route   POST /api/v1/auth/forget-password
 * @access  Public
 */
exports.ForgetPassword = asyncHandler(async (req, res, next) => {
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
exports.verifycode = asyncHandler(async (req, res, next) => {
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
exports.Resetpassword = asyncHandler(async (req, res, next) => {
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

/**
 * @desc    Middleware to check if user is verified
 * @route   POST /api/v1/auth/check-verification
 * @access  Public
 */
exports.checkVerification = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.isVerified) {
        return next(new ApiError('User not verified', 401));
    }
    next();
});


/**
 * @desc    Middleware to protect routes
 * @route   GET /api/v1/auth/protected
 * @access  Private
 */
exports.ProtectedRoters = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError("You are not logged in", 401));
    }
    // 2- Verify token (no chanage happens , expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 3- check if user is Exist or Not
    const user = await User.findById(decoded.userId);
    if (!user) {
        return next(new ApiError('User no longer exists', 401));
    }
    // 4- check if user chanage is password after token created
    if (user.passwordChanagedAt) {
        const passChanagedTimestamp = parseInt(user.passwordChanagedAt.getTime() / 1000, 10);
        // if password chanaged after token created then return error
        if (passChanagedTimestamp > decoded.iat) {
            return next(new ApiError('Your password has been changed, please login again', 401));
        }
    }
    req.user = user;
    next();
});

/**
 * 
 * @desc    Middleware to check user role
 * @route   GET /api/v1/auth/check-role
 * @access  Private
 * @param  {...string} roles 
 * @returns {Function} next()
 * @throws {ApiError} 403 - Forbidden
 */
exports.allwedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!(roles.includes(req.user.role))) {
        return next(new ApiError('You are not authorized to access this route', 403));
    }
    next();
});