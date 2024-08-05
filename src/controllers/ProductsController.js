const model = require("../models/ProductModel");

function dashboard(req, res) {
    // res.send(req.user);
    res.render("dashboard");
}

async function getAllProducts(req, res) {
    const products = await model.getAllProducts();
    res.json(products);
}

module.exports = { dashboard, getAllProducts };
