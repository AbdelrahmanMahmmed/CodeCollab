const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    handle : {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    role :{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    UserResetCode: String,
    UserResetExpire: Date,
    isBlocked: {
        type: Boolean,
        default: false,
    },
    passwordResetCode: String,
    passwordResetExpiret: Date,
    passwordResetVerifed: Boolean,
    passwordChanagedAt: {
        type: Date
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    }],
    requestsGroup:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    }],
    friends : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    friendRequests:{ 
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'User',
            default: []
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    statusMessage :{
        type: String,
        default: null,
    },
}, { timestamps: true });

User.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', User);