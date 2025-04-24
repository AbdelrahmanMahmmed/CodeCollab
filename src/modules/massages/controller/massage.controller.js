const sendMassages = require('./functions/sendMessage');
const getGroupMessages = require('./functions/getGroupMessages');
const sendVoiceMassage = require('./functions/sendVoiceMessage');
const deleteMassage = require('./functions/deleteMessage');
const SendImage = require('./functions/sendImage')

module.exports = {
    sendMassages,
    getGroupMessages,
    sendVoiceMassage,
    deleteMassage,
    SendImage
}