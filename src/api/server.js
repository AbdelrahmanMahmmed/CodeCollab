// External Modules
const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const ApiError = require('../util/APIError');
const globalError = require('../middleware/errormiddleware');
const http = require('http');

// Load environment variables
dotenv.config();

// Internal Modules
const swaggerFile = require('../swagger-output.json');
const dbConnect = require('../config/dbConnection');
const { init } = require('../config/socket'); 
const authRoutes = require("../modules/auth/router/auth.route");
const userRoutes = require("../modules/user/router/user.route");
const groupRoutes = require("../modules/groups/router/group.route");
const messageRoutes = require("../modules/massages/router/massage.route");
const callRoutes = require("../modules/calls/router/call.route");
const complierRoutes = require("../modules/complier/router/complier.route");

// App Initialization
const app = express();
const server = http.createServer(app);
const io = init(server);

// Connect to MongoDB
dbConnect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello in the CodeCollab!');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/group', groupRoutes);
app.use('/api/v1/group', messageRoutes);
app.use('/api/v1/call', callRoutes);
app.use('/api/v1/complier', complierRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error handling middleware
app.use((req, res, next) => {
    next(new ApiError(`No route found for: ${req.originalUrl}`, 404));
});
app.use(globalError);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => process.exit(1));
});

module.exports = app;
