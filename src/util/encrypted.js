const CryptoJS = require("crypto-js");

function encryptMessage(message, messageType) {
    if (!message) return null;

    if (messageType === 'text' || messageType === 'image') {
        try {
            return CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        } catch (err) {
            throw new Error("Encryption failed");
        }
    }
    return message;
}

module.exports = encryptMessage;