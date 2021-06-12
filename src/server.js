require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User");

const app = express();

app.set("view engine", "ejs");

const mongodbURI =
  "mongodb://" +
  process.env.MONGO_SESSION_USERNAME +
  ":" +
  process.env.MONGO_SESSION_PASSWORD +
  "@" +
  "localhost:27017/sessions";

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

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "key that signs the cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  }
  res.redirect("/login");
};

app.get("/", (req, res) => {
  res.render("./pages/index");
});

app.get("/login", (req, res) => {
  res.render("./pages/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    return res.redirect("/login");
  }
  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return res.redirect("/login");
  }
  req.session.isAuth = true;
  req.session.username = user.username;
  res.redirect("/dashboard");
});

app.get("/register", (req, res) => {
  res.render("./pages/register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  let user = await UserModel.findOne({ email });
  if (user) {
    return res.redirect("/register");
  }
  const hashPw = await bcrypt.hash(password, 12);
  user = new UserModel({ username, email, password: hashPw });
  await user.save();
  res.redirect("/login");
});

app.get("/dashboard", isAuth, (req, res) => {
  res.render("./pages/dashboard", { username: req.session.username });
});

app.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("server running on port", PORT));
