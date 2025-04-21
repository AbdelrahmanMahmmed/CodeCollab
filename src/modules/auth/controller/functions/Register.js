const User = require('../../../user/model/user.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const generateProfileImage = require('../../../../util/canvasProfile');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const Register = asyncHandler(async (req, res) => {

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

module.exports = Register;