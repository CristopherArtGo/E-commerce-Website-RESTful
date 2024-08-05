const db = require("../db");

async function getAllProducts() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT products.id, products.name, products.price, categories.category_name FROM products INNER JOIN categories ON products.category_id = categories.id";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}

async function getProductInfo(id) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT products.*, categories.category_name FROM products INNER JOIN categories ON products.category_id = categories.id WHERE products.id = ?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}

module.exports = { getAllProducts, getProductInfo };
