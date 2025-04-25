const swaggerFile = require('../../swagger-output.json');
const dbConnect = require('../../config/dbConnection');
const { init } = require('../../config/socket'); 
const authRoutes = require("../../modules/auth/router/auth.route");
const userRoutes = require("../../modules/user/router/user.route");
const groupRoutes = require("../../modules/groups/router/group.route");
const messageRoutes = require("../../modules/massages/router/massage.route");
const callRoutes = require("../../modules/calls/router/call.route");
const complierRoutes = require("../../modules/complier/router/complier.route");
const friendRoutes = require("../../modules/friends/router/friend.route");

module.exports = {
    swaggerFile,
    dbConnect,
    init,
    authRoutes,
    userRoutes,
    groupRoutes,
    messageRoutes,
    callRoutes,
    complierRoutes,
    friendRoutes,
}