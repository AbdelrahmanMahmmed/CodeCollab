const helmet = require('./helmetConfig');
const rateLimit = require('./rateLimitConfig');
const mongoSanitize = require('./mongoSanitize');
const xssClean = require('./xssClean');
const cors = require('./corsConfig');
const bodyParser = require('./bodyParserLimit');

module.exports = (app) => {
    helmet(app);
    rateLimit(app);
    mongoSanitize(app);
    xssClean(app);
    cors(app);
    bodyParser(app);
};