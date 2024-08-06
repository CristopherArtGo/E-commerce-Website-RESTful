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
Router.get("/profile", UsersController.authenticateToken, AdminsController.checkRole, UsersController.profile);

Router.get("/admin", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, AdminsController.adminDashboard);
Router.get("/products/new", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, AdminsController.newProduct);
Router.get("/products/edit/:id", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, AdminsController.editProduct);
Router.get("/products/delete/:id", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, AdminsController.deleteProduct);

Router.get("/products", UsersController.authenticateToken, AdminsController.checkRole, ProductsController.dashboard);
Router.get("/products/:id", UsersController.authenticateToken, AdminsController.checkRole, ProductsController.productPage);

Router.get("/api/users/:id", UsersController.getUser);
Router.get("/api/products", ProductsController.getAllProducts);
Router.get("/api/products/:id", ProductsController.productInfo);
Router.post("/api/products", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, ProductsController.addProduct);
Router.put("/api/products/:id", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, ProductsController.updateProduct);
Router.delete("/api/products/:id", UsersController.authenticateToken, AdminsController.checkRole, AdminsController.filterUser, ProductsController.deleteProduct);
Router.get("/api/categories", ProductsController.getAllCategories);

module.exports = Router;
