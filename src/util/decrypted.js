const CryptoJS = require("crypto-js");

const decryptMessages = (messages, secretKey) => {
    return messages.map(msg => {
        const encrypted = msg.message || msg.content;
        const type = msg.messageType || msg.type;

        const decryptedContent = type === 'text'
            ? CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8)
            : encrypted;

        return {
            sender: msg.sender?.name || msg.sender,
            type,
            content: decryptedContent,
            timestamp: msg.timestamp || msg.createdAt
        };
    });
};

module.exports = decryptMessages;
