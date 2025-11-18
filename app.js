const express = require("express");
const path = require("path");

const app = express();

// view engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// for handling form submissions
app.use(express.urlencoded({ extended: true }));

// use routes
const pagesRouter = require("./routes/pages");
app.use("/", pagesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running at http://localhost:" + PORT);
});
