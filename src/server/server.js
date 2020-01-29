require("dotenv").config(); //.env file must be at root
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const pollsRouter = require("./routes/polls");
const usersRouter = require("./routes/users");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

(async () => {
    try {
        mongoose.Promise = global.Promise; 

        const app = express();        
        app.use(session({
            name: process.env.SESS_NAME,
            secret: process.env.SESS_SECRET,
            saveUninitialized: false, //permissions for setting a cookie are required
            resave: false, //prevents unnecessary re-saves
            store: new MongoStore({
              mongooseConnection: mongoose.connection,
              collection: 'session',
              ttl: parseInt(process.env.SESS_LIFETIME) / 1000 //uses seconds instead of milliseconds, match sess lifetime
            }),
            cookie: {
              sameSite: true, //helps prevent CSRF attacks
              secure: process.env.NODE_ENV === 'production',
              maxAge: parseInt(process.env.SESS_LIFETIME)
            }
          }));
        app.use(cors());
        // app.use(express.static("dist"));
        app.use(express.urlencoded()); //Parse URL-encoded bodies
        app.use(express.json()); //instead of bodyParser, since 4.16 Express; extended - nested objects allowed


        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });
        
        const uri = process.env.MONGODB_URI;
        mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
        const connection = mongoose.connection;
        connection.once("open", () => {
            console.log("Connection with MongoDB database established");
        });
        
        app.use("/api/polls", pollsRouter);
        app.use("/api/user", usersRouter);
        
        // app.get('/*', function(req, res) {
        //     res.sendFile(path.join(__dirname, 'dist/index.html'), function(err) {
        //       if (err) {
        //         res.status(500).send(err)
        //       }
        //     })
        //   })
        
        app.listen(process.env.PORT || 8080, () => {
            console.log(`app is running`);
        });
    } catch(err) {
        console.error(err);
    }
})();

