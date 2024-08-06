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

async function getAllCategories() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM categories";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}

async function createProduct(product) {
    try {
        let inputErrors = validateProduct(product);

        if (inputErrors) {
            throw { error: inputErrors };
        }

        let { name, price, category, description } = product;

        let currentTime = new Date().toISOString();
        let sql = "INSERT INTO products(name, price, category_id, description, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)";

        return new Promise((resolve, reject) => {
            db.run(sql, [name, price, category, description, currentTime, currentTime], (err) => {
                if (err) {
                    reject(err.message);
                }
                resolve({ success: "Product created successfully" });
            });
        });
    } catch (error) {
        return error;
    }
}

async function updateProduct(product) {
    try {
        let inputErrors = validateProduct(product);

        if (inputErrors) {
            throw { error: inputErrors };
        }

        let { id, name, price, category, description } = product;

        let currentTime = new Date().toISOString();
        let sql = "UPDATE products SET name = ?, price = ?, category_id = ?, description = ?, updated_at = ? where id = ?";

        return new Promise((resolve, reject) => {
            db.run(sql, [name, price, category, description, currentTime, id], (err) => {
                if (err) {
                    reject(err.message);
                }
                resolve({ success: "Product updated successfully" });
            });
        });
    } catch (error) {
        return error;
    }
}

function validateProduct(userInput) {
    let { name, price, category, description } = userInput;

    let inputErrors = [];
    if (!name) {
        inputErrors.push("Product Name cannot be blank");
    }

    if (!price) {
        inputErrors.push("Price cannot be blank");
    }

    if (!category) {
        inputErrors.push("Category cannot be blank");
    }

    if (!description) {
        inputErrors.push("Description cannot be blank");
    }

    if (inputErrors.length) {
        return inputErrors;
    }

    return false;
}

async function deleteProduct(product) {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM products WHERE id = ?";
        db.run(sql, [product.id], (err) => {
            if (err) {
                reject(err.message);
            }
            resolve({ success: "Product deleted successfully" });
        });
    });
}

module.exports = { getAllProducts, getProductInfo, getAllCategories, createProduct, updateProduct, deleteProduct };
