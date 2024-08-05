const db = require("../db");

async function getAllProducts() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT products.*, categories.category_name FROM products INNER JOIN categories ON products.category_id = categories.id";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}

module.exports = { getAllProducts };
