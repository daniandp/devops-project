// load env variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection err:", err.message);
  });

// static files
app.use(express.static(path.join(__dirname, "public")));

// for handling form submissions
app.use(express.urlencoded({ extended: true }));

// session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// page routes
const pagesRouter = require("./routes/pages");
app.use("/", pagesRouter);

// api routes
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running at http://localhost:" + PORT);
});
