import * as passport from 'passport';
// const LocalStrategy = require('passport-local').Strategy;
// const { compareSync } = require('bcryptjs');
// import User from './models/user.model';

require('dotenv').config(); // .env file must be at root
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

import usersRouter = require('./routes/users');
import pollsRouter = require('./routes/polls');

(async () => {
  try {
    // passport.use(new LocalStrategy(async (username, password, done) => {
    //   try {
    //     const user = await User.findOne({ username });
    //     if (!user) {
    //       return done(null, false, { message: 'Incorrect username.' });
    //     }
    //     if (!compareSync(password, user.password)) {
    //       return done(null, false, { message: 'Incorrect password.' });
    //     }
    //     return done(null, user);
    //   } catch (err) {
    //     return done(err);
    //   }
    // }));

    // passport.serializeUser((user:{id:string, username?:string}, done) => {
    //   done(null, user.id);
    // });

    // passport.deserializeUser((_id, done) => {
    //   User.findById(_id, (err, user) => {
    //     done(err, user);
    //   });
    // });


    mongoose.Promise = global.Promise;

    const whitelist = ['http://localhost:3000', 'http://localhost:8080'];
    const corsOptions = {
      origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    };

    const app = express();
    app.use(session({
      name: process.env.SESS_NAME,
      secret: process.env.SESS_SECRET,
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'session',
        ttl: 60 * 60,
      }),
      cookie: {
        sameSite: false,
        secure: process.env.NODE_ENV === 'prod',
        maxAge: 86400000,
      },
    }));

    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(express.json()); // instead of bodyParser, since 4.16 Express; extended

    app.use(passport.initialize());
    app.use(passport.session());

    // app.use(cors(corsOptions));
    app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes
    app.use(express.static('dist'));
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, POST, DELETE, HEAD, OPTIONS');
      res.header('Access-Control-Max-Age', 86400);
      next();
    });


    const uri = process.env.MONGODB_URI;
    mongoose.connect(uri,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    const { connection } = mongoose;
    connection.once('open', () => {
      console.log('Connection with MongoDB database established');
    });

    app.use('/api/polls', pollsRouter);
    app.use('/api/user', usersRouter);

    app.listen(process.env.PORT || 8080, () => {
      console.log('App is running!');
    });
  } catch (err) {
    console.error(err);
  }
})();
