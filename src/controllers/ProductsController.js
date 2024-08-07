const productModel = require("../models/ProductModel");
const userModel = require("../models/UserModel");

async function dashboard(req, res) {
    let user = await userModel.getUserByEmail(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("products", { first_name: user.first_name, role: req.user.role });
}

async function getAllProducts(req, res) {
    const products = await productModel.getAllProducts();
    res.json(products);
}

async function productPage(req, res) {
    const url = req.url;
    const index = url.lastIndexOf("/");
    const product_id = url.slice(index + 1);
    const product = await productModel.getProductInfo(product_id);

    if (product.id) {
        let user = await userModel.getUserByEmail(req.user.email);
        user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
        res.render("productPage", { first_name: user.first_name, role: req.user.role });
    } else {
        redirect("/products");
    }
}

async function productInfo(req, res) {
    const product = await productModel.getProductInfo(parseInt(req.params.id));
    res.json(product);
}

async function getAllCategories(req, res) {
    const categories = await productModel.getAllCategories();
    res.json(categories);
}

async function addProduct(req, res) {
    let result = await productModel.createProduct(req.body);
    res.json(result);
}

async function updateProduct(req, res) {
    let result = await productModel.updateProduct(req.body);
    res.json(result);
}

async function deleteProduct(req, res) {
    let result = await productModel.deleteProduct(req.body);
    res.json(result);
}

module.exports = { dashboard, getAllProducts, productInfo, productPage, getAllCategories, addProduct, updateProduct, deleteProduct };
