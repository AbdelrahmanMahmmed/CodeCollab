const sendMassages = require('./functions/sendMessage');
const getGroupMessages = require('./functions/getGroupMessages');
const sendVoiceMassage = require('./functions/sendVoiceMessage');
const deleteMassage = require('./functions/deleteMessage');

module.exports = {
    sendMassages,
    getGroupMessages,
    sendVoiceMassage,
    deleteMassage
}