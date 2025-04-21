const User = require('../../../user/model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const ApiError = require('../../../../util/APIError');


/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const Login = asyncHandler(async (req, res) => {
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

module.exports = Login ;