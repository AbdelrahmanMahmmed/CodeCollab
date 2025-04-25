const mongoose = require('mongoose');
const crypto = require('crypto');

const compilerFileSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            default: '',
        },
        language_id: {
            type: Number,
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);


compilerFileSchema.methods.setCode = function (plainCode, secretKey) {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encrypted = cipher.update(plainCode, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    this.code = encrypted;
};

compilerFileSchema.methods.getCode = function (secretKey) {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decrypted = decipher.update(this.code, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = mongoose.model('Compiler', compilerFileSchema);
