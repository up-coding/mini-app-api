const express = require("express");
const app = express();
const http = require("http");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const appConfig = require("./config/appConfig");
const appErrorHandler = require("./app/middlewares/appErrorHandler");
const routeLogger = require("./app/middlewares/routeLogger");
const modelsPath = "./app/models";
const routesPath = "./app/routes";

//Middlewares

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(routeLogger.ipLogger);
app.use(express.static(path.join(__dirname, "../mini-app/dist/mini-app")));
app.use(appErrorHandler.globalErrorHandler);

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

//Boostrap models
fs.readdirSync(modelsPath).forEach(file => {
  if (~file.indexOf(".js")) require(modelsPath + "/" + file);
});

//Boostrap routes
fs.readdirSync(routesPath).forEach(file => {
  if (~file.indexOf(".js")) {
    require(routesPath + "/" + file).setRouter(app);
  }
});
app.use(appErrorHandler.globalNotFoundHandler);

const server = http.createServer(app);
server.listen(appConfig.port, err => {
  if (err) {
    console.log("Database error.", err);
  } else {
    console.log("Database connection open.");
    let db = mongoose.connect(appConfig.dbUri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

module.exports = app;
