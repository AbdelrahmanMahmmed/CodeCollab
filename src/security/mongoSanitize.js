const mongoSanitize = require('express-mongo-sanitize');

module.exports = (app) => {
    app.use(mongoSanitize());
};