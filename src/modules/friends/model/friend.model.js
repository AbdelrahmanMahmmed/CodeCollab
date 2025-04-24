const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    massages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        messageType: { type: String, enum: ['text', 'image'], default: 'text' },
        createdAt: { type: Date, default: Date.now }
    }]    
}, { timestamps: true });

module.exports = mongoose.model('friend', friendSchema);