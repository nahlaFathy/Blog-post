const express = require('express');
const app = express();
var cors = require('cors')
require('./db_connection/mongodb');
require('dotenv').config();
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
const IN_PROD = process.env.NODE_ENV === 'production';
const Users = require('./Routes/UserRoutes');
const Posts = require('./Routes/PostRoutes');
let morgan = require('morgan');
let config = require('config');




//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

/////// check if env variables is set or no /////
if (!process.env.SECRET_KEY||!process.env.REDIS_HOST||!process.env.REDIS_PASS||!process.env.REDIS_PORT||!process.env.SESSION_SECRET) {
    console.error('FATAL ERROR: One of environment variables is not defined !!')
    ////// 0 exit with succeed otherwisw exit with fail
    process.exit(1)
  };

//// redis error logs
let redisClient = redis.createClient({
  
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password:process.env.REDIS_PASS
});
redisClient.on('error', err => {
  console.log('Error ' + err);
});

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({

    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
      secure: IN_PROD,
      sameSite: true,
      maxAge: 1000 * 60 * 60
    },
    store: new RedisStore({ client: redisClient, ttl: 86400 }),
    resave: false
  }))

  //////////////////////////////////////////////////////////////////////////
app.use(express.static('public'));                      // store anything in static public file like files or images 
app.use(express.json());                                // parses incoming requests with JSON payloads and is based on body-parser
app.use(express.urlencoded({ extended: true }));        // parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(cors())                                         // used to enable CORS with various options
app.use(cookieParser())                                 // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.


// This middleware will check if user's cookie is still saved in browser and user is not set,
// then automatically log the user out.
app.use((req, res, next) => {
    
    if (req.cookies.user && !req.session.user) {
      res.clearCookie('user');
    }
    next();
  });


  // a middleware that logs the request url, method, and current time 
app.use((req, res, next) => {
    var time = new Date();
    console.log('Time:', time.getHours(), ':', time.getMinutes(), ':', time.getSeconds())
    console.log('Method:', req.method)
    console.log('URL:', req.url)
    next()
  });

  // a global error handler that logs the error 
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send({ error: 'internal server error' })
    next(err);
  });

//////General Routes
app.use('/api', Users)
app.use('/api/post', Posts)

  //////////////////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 3000, () => {
    console.info(`server listening on port 3000`);
});
module.exports = app