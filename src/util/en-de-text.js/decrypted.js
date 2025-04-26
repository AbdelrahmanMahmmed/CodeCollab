const CryptoJS = require('crypto-js');

function decrypt(cipherText, key) {
    try{
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        if(bytes.sigBytes > 0){
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        }
    } catch(error){
        throw new Error('Invalid key')
    } 
}

module.exports = decrypt;