const express = require("express");
const Router = express.Router();

const UsersController = require("./controllers/UsersController");
Router.get("/login", UsersController.index);
Router.get("/signup", UsersController.signup);
Router.post("/users", UsersController.createUser);
Router.post("/login", UsersController.loginUser);
Router.get("/dashboard", UsersController.authenticateToken, UsersController.dashboard);
Router.get("/refresh", UsersController.refreshToken);

module.exports = Router;
