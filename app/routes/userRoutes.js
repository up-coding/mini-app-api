const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const auth = require("./../middlewares/auth");

module.exports.setRouter = app => {
  app.post(`/user/signup`, userController.userSignup);
  app.post(`/user/login`, userController.userLogin);
  app.post(`/user/logout`, auth.isAuthorized, userController.userLogout);
};
