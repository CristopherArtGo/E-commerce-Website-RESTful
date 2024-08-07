const bcrypt = require("bcrypt");
const db = require("../db");

function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "SELECT * FROM users",
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

async function createUser(user) {
    try {
        const inputErrors = validateSignup(user);

        if (inputErrors) {
            throw { error: inputErrors };
        }

        const { first_name, last_name, email, password } = user;
        const currentTime = new Date().toISOString();
        const passwordHash = bcrypt.hashSync(password, 10);
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw { error: ["Email already taken!"] };
        }

        const query = {
            text: "INSERT INTO users(first_name, last_name, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6)",
            values: [first_name, last_name, email, passwordHash, currentTime, currentTime],
        };

        await db.query(query);
        return { success: "User created successfully" };
    } catch (error) {
        return error;
    }
}

async function loginUser(user) {
    if (!user.email || !user.password) {
        return { error: ["Email and Password must not be blank"] };
    }

    const existingUser = await getUserByEmail(user.email);

    if (existingUser && bcrypt.compareSync(user.password, existingUser.password)) {
        return existingUser;
    }

    return { error: ["Invalid Credentials"] };
}

function validateSignup(userInput) {
    const { first_name, last_name, email, password, confirm_password } = userInput;
    let inputErrors = [];

    if (!first_name) {
        inputErrors.push("First Name cannot be blank");
    }

    if (!last_name) {
        inputErrors.push("Last Name cannot be blank");
    }

    if (!email) {
        inputErrors.push("Email cannot be blank");
    }

    if (!password) {
        inputErrors.push("Password cannot be blank");
    }

    if (password && password.length < 8) {
        inputErrors.push("Password must be at least 8 characters");
    }

    if (password && password !== confirm_password) {
        inputErrors.push("Passwords do not match");
    }

    if (inputErrors.length) {
        return inputErrors;
    }

    return false;
}

function getUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "SELECT * FROM users WHERE email = $1",
            values: [email],
        };

        try {
            const { rows } = await db.query(query);
            resolve(rows[0]);
        } catch (err) {
            reject(err.message);
        }
    });
}

function saveToken(email, token) {
    return new Promise(async (resolve, reject) => {
        try {
            const tokenHash = bcrypt.hashSync(token, 10);

            const query = {
                text: "INSERT INTO tokens(email, token) VALUES($1, $2) ON CONFLICT (email) DO UPDATE SET token = $2",
                values: [email, tokenHash],
            };

            await db.query(query);
            resolve("Token Created");
        } catch (err) {
            reject(err);
        }
    });
}

function verifyToken(email, token) {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "SELECT * FROM tokens WHERE email = $1",
            values: [email],
        };

        try {
            const { rows } = await db.query(query);

            if (rows[0] && bcrypt.compareSync(token, rows[0].token)) {
                resolve("match");
            }   

            resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}

function logout(email) {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "DELETE FROM tokens WHERE email = $1",
            values: [email],
        };

        try {
            await db.query(query);
        } catch (err) {
            reject(err);
        }
        resolve();
    });
}

function getUserById(id) {
    return new Promise(async (resolve, reject) => {
        const query = {
            text: "SELECT * FROM users WHERE id = $1",
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

module.exports = { getAllUsers, createUser, loginUser, saveToken, verifyToken, logout, getUserByEmail, getUserById };
