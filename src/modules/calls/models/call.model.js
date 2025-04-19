const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    group: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Group' 
    },
    isActive: { 
        type: Boolean, default: true 
    },
    startedBy: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' 

        }]
} , {timestamps: true});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;