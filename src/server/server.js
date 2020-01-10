const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const pollsRouter = require("./routes/polls");
const usersRouter = require("./routes/users");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json()); //instead of bodyParser, since 4.16 Express
app.use(express.urlencoded()); //Parse URL-encoded bodies

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Connection with MongoDB database established");
})

app.use("/polls", pollsRouter);
app.use("/users", usersRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`app is running`);
})