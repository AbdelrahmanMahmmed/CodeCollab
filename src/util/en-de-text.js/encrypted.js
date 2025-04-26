const CryptoJS = require('crypto-js');
function encrypt(text, key) {
    const cipherText = CryptoJS.AES.encrypt(text, key).toString();
    return cipherText;
}

module.exports = encrypt;