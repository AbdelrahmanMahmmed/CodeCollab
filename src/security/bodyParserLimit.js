module.exports = (app) => {
    app.use(require('express').json({ limit: '10kb' }));
};