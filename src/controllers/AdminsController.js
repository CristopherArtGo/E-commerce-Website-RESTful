const userModel = require("../models/UserModel");
const productModel = require("../models/ProductModel");

async function checkRole(req, res, next) {
    const email = req.user.email;
    let user = await userModel.getUser(email);
    if (user) {
        req.user.role = user.is_admin;
        next();
    } else {
        res.redirect("/logout");
    }
}

async function adminDashboard(req, res) {
    let user = await userModel.getUser(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("adminDashboard", { first_name: user.first_name, role: req.user.role });
}

function filterUser(req, res, next) {
    if (req.user.role) {
        next();
    } else {
        res.redirect("/products");
    }
}

async function newProduct(req, res) {
    let user = await userModel.getUser(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("newProduct", { first_name: user.first_name, role: req.user.role });
}

async function editProduct(req, res) {
    const url = req.url;
    const index = url.lastIndexOf("/");
    const product_id = url.slice(index + 1);
    const product = await productModel.getProductInfo(product_id);

    if (product[0].id) {
        let user = await userModel.getUser(req.user.email);
        user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
        res.render("editProduct", { first_name: user.first_name, role: req.user.role });
    } else {
        res.redirect("/admin");
    }
}

async function deleteProduct(req, res) {
    const url = req.url;
    const index = url.lastIndexOf("/");
    const product_id = url.slice(index + 1);
    const product = await productModel.getProductInfo(product_id);

    if (product[0].id) {
        let user = await userModel.getUser(req.user.email);
        user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
        res.render("deleteProduct", { first_name: user.first_name, role: req.user.role });
    } else {
        res.redirect("/admin");
    }
}

module.exports = { checkRole, adminDashboard, filterUser, newProduct, editProduct, deleteProduct };
