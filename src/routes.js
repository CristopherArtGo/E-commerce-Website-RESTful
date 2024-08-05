const express = require("express");
const Router = express.Router();

const UsersController = require("./controllers/UsersController");
const ProductsController = require("./controllers/ProductsController");

Router.get("/", UsersController.authenticateToken, UsersController.index);
Router.get("/login", UsersController.login);
Router.get("/signup", UsersController.signup);
Router.post("/users", UsersController.createUser);
Router.post("/login", UsersController.loginUser);
Router.get("/refresh", UsersController.refreshToken);
Router.get("/logout", UsersController.logout);

Router.get("/products", UsersController.authenticateToken, ProductsController.dashboard);
Router.get("/products/:id", ProductsController.productPage);

Router.get("/api/products", ProductsController.getAllProducts);
Router.get("/api/products/:id", ProductsController.productInfo);

module.exports = Router;
