const express = require("express");
const Router = express.Router();

const UsersController = require("./controllers/UsersController");
const ProductsController = require("./controllers/ProductsController");
const AdminsController = require("./controllers/AdminsController");

Router.get("/", UsersController.authenticateToken, UsersController.index);
Router.get("/login", UsersController.login);
Router.get("/signup", UsersController.signup);
Router.post("/users", UsersController.createUser);
Router.post("/login", UsersController.loginUser);
Router.get("/refresh", UsersController.refreshToken);
Router.get("/logout", UsersController.logout);

Router.get("/products", UsersController.authenticateToken, AdminsController.checkRole, ProductsController.dashboard);
Router.get("/products/:id", UsersController.authenticateToken, AdminsController.checkRole, ProductsController.productPage);

Router.get("/api/products", ProductsController.getAllProducts);
Router.get("/api/products/:id", ProductsController.productInfo);

Router.get("/admin", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, AdminsController.adminDashboard);

module.exports = Router;
