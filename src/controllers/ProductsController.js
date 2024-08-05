const productModel = require("../models/ProductModel");
const userModel = require("../models/UserModel");

async function dashboard(req, res) {
    let user = await userModel.getUser(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("products", { first_name: user.first_name, role: req.user.role });
}

async function getAllProducts(req, res) {
    const products = await productModel.getAllProducts();
    res.json(products);
}

async function productPage(req, res) {
    let user = await userModel.getUser(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("productPage", { first_name: user.first_name, role: req.user.role });
}

async function productInfo(req, res) {
    const product = await productModel.getProductInfo(parseInt(req.params.id));
    res.json(product);
}

module.exports = { dashboard, getAllProducts, productInfo, productPage };
