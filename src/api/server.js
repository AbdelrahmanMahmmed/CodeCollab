// External Modules
const { express, dotenv, swaggerUi, ApiError, globalError, http, } = require('./import/libararys');


// Load environment variables
dotenv.config();

// Internal Modules
const swaggerFile = require('../swagger-output.json');
const { dbConnect,init,authRoutes,userRoutes,
        groupRoutes,messageRoutes,callRoutes,
        complierRoutes,friendRoutes,} = require('./import/moudles');

// App Initialization
const app = express();
const server = http.createServer(app);
const io = init(server);

// Security Middleware
// require('../security/index')(app);

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
app.use('/api/v1/friend', friendRoutes);

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