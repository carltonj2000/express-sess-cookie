require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

const app = express();

const mongodbURI =
  "mongodb://" +
  process.env.MONGO_SESSION_USERNAME +
  ":" +
  process.env.MONGO_SESSION_PASSWORD +
  "@" +
  "localhost:27017/sessions";

console.log(mongodbURI);
mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("MongDB Connected"));

const store = new MongoDBStore({
  uri: mongodbURI,
  collection: "mySessions",
});

app.use(
  session({
    secret: "key that signs the cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get("/", (req, res) => {
  req.session.isAuth = true;
  console.log(req.session);
  console.log(req.session.id);
  res.send("Session Tutorial");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("server running on port", PORT));
