const mongoose = require('mongoose');
const crypto = require('crypto');

const compilerSchema = new mongoose.Schema({
    group: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true 
    },
    code: {
        type: String,
        default: '',
    },
}, { timestamps: true });

compilerSchema.methods.setCode = function (plainCode, secretKey) {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encrypted = cipher.update(plainCode, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    this.code = encrypted;
};

compilerSchema.methods.getCode = function (secretKey) {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decrypted = decipher.update(this.code, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = mongoose.model('Compiler', compilerSchema);
