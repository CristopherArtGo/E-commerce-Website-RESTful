const express = require("express");
const Router = express.Router();

const UsersController = require("./controllers/UsersController");
Router.get("/login", UsersController.index);
Router.get("/signup", UsersController.signup);
Router.post("/users", UsersController.createUser);

module.exports = Router;
