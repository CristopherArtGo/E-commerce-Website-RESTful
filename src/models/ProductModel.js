const db = require("../db");

function getAllProducts() {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "SELECT products.*, categories.category_name FROM products INNER JOIN categories ON products.category_id = categories.id ORDER BY products.id",
            value: [],
        };

        try {
            let { rows } = await db.query(query);
            resolve(rows);
        } catch (err) {
            reject(err);
        }
    });
}

function getProductInfo(id) {
    return new Promise(async (resolve, reject) => {
        let query = {
            text: "SELECT products.*, categories.category_name FROM products INNER JOIN categories ON products.category_id = categories.id WHERE products.id = $1",
            values: [id],
        };

        try {
            const { rows } = await db.query(query);
            resolve(rows[0]);
        } catch (err) {
            reject(err);
        }
    });
}

function getAllCategories() {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "SELECT * FROM categories",
            values: [],
        };

        try {
            const { rows } = await db.query(query);
            resolve(rows);
        } catch (err) {
            reject(err);
        }
    });
}

async function createProduct(product) {
    try {
        const inputErrors = validateProduct(product);

        if (inputErrors) {
            throw { error: inputErrors };
        }

        const { name, price, category, description } = product;
        const currentTime = new Date().toISOString();

        const query = {
            text: "INSERT INTO products(name, price, category_id, description, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6)",
            values: [name, price, category, description, currentTime, currentTime],
        };

        await db.query(query);
        return { success: "Product created successfully" };
    } catch (error) {
        return error;
    }
}

async function updateProduct(product) {
    try {
        const inputErrors = validateProduct(product);

        if (inputErrors) {
            throw { error: inputErrors };
        }

        const { id, name, price, category, description } = product;
        const currentTime = new Date().toISOString();

        const query = {
            text: "UPDATE products SET name = $1, price = $2, category_id = $3, description = $4, updated_at = $5 where id = $6",
            values: [name, price, category, description, currentTime, id],
        };

        await db.query(query);
        return { success: "Product updated successfully" };
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

function deleteProduct(product) {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "DELETE FROM products WHERE id = $1",
            values: [product.id],
        };

        try {
            await db.query(query);
            resolve({ success: "Product deleted successfully" });
        } catch (err) {
            reject(err.message);
        }
    });
}

module.exports = { getAllProducts, getProductInfo, getAllCategories, createProduct, updateProduct, deleteProduct };
