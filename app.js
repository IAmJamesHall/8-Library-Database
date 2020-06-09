const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const books = require("./routes/books");

const app = express();
const path = require("path");

// view engine (pug) setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// cookie parser
app.use(cookieParser());

//process incoming POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//set dir for static files
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/books", books);

// catch 404s
app.use((req, res, next) => {
  const error = new Error("404 - not found");
  next(error);
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(res.locals.error);
  res.render("error", { err });
});

module.exports = app;
