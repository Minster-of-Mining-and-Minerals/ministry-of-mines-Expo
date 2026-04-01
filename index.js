const express = require("express");
require('dotenv').config({path: './.env'});

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
const sqliteStore = require('connect-sqlite3')(session);

const sessionStore = new sqliteStore({
    db: 'sessions.sqlite3',
    dir: './db'
});
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;


// Routers
const {authRouter} = require('./routes/auth');
const zoneRouter = require('./routes/zone');
const resourceRouter = require('./routes/resource');
const indexRouter = require('./routes/index')

// Setup database
const dbSetup = require('./db/db-setup');
dbSetup();

// Use compression to compress server responses
server.use(compression());

// Set EJS 
server.engine('ejs', ejsMate);
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'))

server.use(express.static(path.join(__dirname, 'public')))

// On every request:
server.use(morgan('dev')); // Use request logger
server.use((req,res,next)=>{
    console.log("------------------- New Request -------------------")
    console.log(req.method, req.path);
    next();
})

server.use(methodOverride('_method'));

//server.use(fileUpload());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
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

server.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    console.log("Current User:", req.user)
    // console.dir(req.session)
    next();
})
// Routes
server.get('/', indexRouter);
server.use('/', authRouter);
server.use('/', zoneRouter);
server.use('/', resourceRouter);

server.use((req,res)=>{
    res.status(404).send("404");
});

server.listen(3000 ,process.env.SERVER_HOST, ()=>{
    console.log("Host:", process.env.SERVER_HOST)
    console.log("Listening on port 3000");
    
});