const express = require("express");
require('dotenv').config({ path: './.env' });

// Fail fast if required settings are missing
const missingEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'SESSION_SECRET']
    .filter(name => !process.env[name]);
if (missingEnv.length) {
    console.error("Missing required environment variables:", missingEnv.join(', '));
    process.exit(1);
}

const compression = require('compression');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const path = require("path");
const server = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override')

const logger = require('morgan');
const { passport } = require('./routes/auth');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);

const sessionStore = new PgSession({
    conString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    createTableIfMissing: true
});
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;


// Routers
const { authRouter } = require('./routes/auth');
const zoneRouter = require('./routes/zone');
const resourceRouter = require('./routes/resource');
const indexRouter = require('./routes/index')

// Setup database
const dbSetup = require('./db/db-setup');
const db = dbSetup();

// Requests arrive through Nginx or Docker port mapping
server.set('trust proxy', 1);

// Health check - registered before logging and sessions so probes stay quiet
server.get('/health', async (req, res) => {
    try {
        await db.raw('select 1');
        res.json({ status: 'ok' });
    } catch (err) {
        console.error("Health check failed:", err.message);
        res.status(503).json({ status: 'error' });
    }
});

// Use compression to compress server responses
server.use(compression());

// Set EJS 
server.engine('ejs', ejsMate);
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'))

server.use(express.static(path.join(__dirname, 'public')))

// On every request:
server.use(morgan('dev')); // Use request logger
server.use((req, res, next) => {
    console.log("------------------- New Request -------------------")
    console.log(req.method, req.path);
    next();
})

server.use(methodOverride('_method'));

//server.use(fileUpload());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
console.log()
// Session
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: ONE_WEEK,
        sameSite: true,
        // secure: true
    }
}));

// Use Passport
server.use(passport.initialize());
server.use(passport.session()); // persistent login sessions\

server.use((req, res, next) => {
    res.locals.currentUser = req.user;
    console.log("Current User:", req.user ? req.user.username : undefined)
    // console.dir(req.session)
    next();
})
// Routes
server.get('/', indexRouter);
server.use('/', authRouter);
server.use('/', zoneRouter);
server.use('/', resourceRouter);

server.use((req, res) => {
    res.status(404).send("404");
});

const PORT = process.env.PORT || 4003;
const httpServer = server.listen(PORT, process.env.SERVER_HOST, () => {
    console.log("Host:", process.env.SERVER_HOST)
    console.log("Listening on port", PORT);

});

// Graceful shutdown when Docker stops the container
const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    setTimeout(() => process.exit(1), 10000).unref();
    httpServer.close(async () => {
        await sessionStore.close();
        await db.destroy();
        process.exit(0);
    });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));