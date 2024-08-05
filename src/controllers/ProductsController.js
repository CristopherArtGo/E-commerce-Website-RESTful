const model = require("../models/ProductModel");

function dashboard(req, res) {
    // res.send(req.user);
    res.render("products");
}

async function getAllProducts(req, res) {
    const products = await model.getAllProducts();
    res.json(products);
}

function productPage(req, res) {
    res.render("productPage");
}

async function productInfo(req, res) {
    const product = await model.getProductInfo(parseInt(req.params.id));
    res.json(product);
}

module.exports = { dashboard, getAllProducts, productInfo, productPage };
