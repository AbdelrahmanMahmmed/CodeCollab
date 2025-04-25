const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    file :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compiler',
    },
    versions : [
        {
            IdCommit: {
                type: String,
                required: true,
            },
            code : {
                type: String,
                default: '',
            },
            createdAt : {
                type: Date,
                default: Date.now,
            },
            createdBy : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        }
    ]
},{timestamps:true});

const Version = mongoose.model('Version', versionSchema);

module.exports = Version;