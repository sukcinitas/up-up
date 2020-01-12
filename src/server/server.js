const dotenv = require("dotenv");
dotenv.config();

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


mongoose.connect("mongodb+srv://gintare_cer:pavasarisateina@cluster0-t4lki.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Connection with MongoDB database established");
})

app.use("/", pollsRouter);
app.use("/", usersRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`app is running`);
})