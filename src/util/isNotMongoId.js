module.exports = function isNotMongoId(value) {
    const isValidMongoId = /^[a-f\d]{24}$/i.test(value);
    if (isValidMongoId) {
        throw new Error('This field must NOT be a valid MongoId');
    }
    return true;
};