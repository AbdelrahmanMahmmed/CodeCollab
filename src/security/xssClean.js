const xss = require('xss-clean');

module.exports = (app) => {
    app.use(xss());
};