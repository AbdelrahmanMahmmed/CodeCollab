const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('friend', friendSchema);