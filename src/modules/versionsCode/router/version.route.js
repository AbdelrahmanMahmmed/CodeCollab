const express = require('express');
const router = express.Router();

const { middlewareFunctions } = require('../../auth/controller/auth.controller');
const versionController = require('../controller/version.controller');



router.use(middlewareFunctions.ProtectedRoters);

router.get('/version/:idCommit', versionController.getVersionByIdCommit);


module.exports = router;