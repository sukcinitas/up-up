require("dotenv").config(); //.env file must be at root

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const pollsRouter = require("./routes/polls");
const usersRouter = require("./routes/users");

mongoose.Promise = global.Promise;

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json()); //instead of bodyParser, since 4.16 Express
app.use(express.urlencoded()); //Parse URL-encoded bodies

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
})

app.use("/polls", pollsRouter);
app.use("/user", usersRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`app is running`);
})