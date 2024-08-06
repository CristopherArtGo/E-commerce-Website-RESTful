const bcrypt = require("bcrypt");
const db = require("../db");

function getAllUsers() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM users";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

async function createUser(user) {
    try {
        let inputErrors = validateSignup(user);

        if (inputErrors) {
            throw { error: inputErrors };
        }

        let { first_name, last_name, email, password } = user;

        let currentTime = new Date().toISOString();
        let passwordHash = bcrypt.hashSync(password, 10);
        let sql = "INSERT INTO users(first_name, last_name, email, password, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)";

        let existingUser = await findUser(email);

        if (existingUser) {
            throw { error: ["Email already taken!"] };
        }

        return new Promise((resolve, reject) => {
            db.run(sql, [first_name, last_name, email, passwordHash, currentTime, currentTime], (err) => {
                if (err) {
                    reject(err.message);
                }
                resolve({ success: "User created successfully" });
            });
        });
    } catch (error) {
        return error;
    }
}

async function loginUser(user) {
    if (!user.email || !user.password) {
        return { error: ["Email and Password must not be blank"] };
    }

    let existingUser = await findUser(user.email);

    if (existingUser && bcrypt.compareSync(user.password, existingUser.password)) {
        return existingUser;
    }

    return { error: ["Invalid Credentials"] };
}

function validateSignup(userInput) {
    let { first_name, last_name, email, password, confirm_password } = userInput;

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

function findUser(email) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM users WHERE email = ?";
        db.all(sql, [email], (err, row) => {
            if (err) {
                reject(err.message);
            }
            if (row) {
                resolve(row[0]);
            }

            resolve(undefined);
        });
    });
}

async function saveToken(user, token) {
    return new Promise((resolve, reject) => {
        let tokenHash = bcrypt.hashSync(token, 10);

        let userExists = async () => {
            return new Promise((resolve, reject) => {
                let sql = "SELECT * FROM tokens WHERE email = ?";
                db.get(sql, [user], (err, row) => {
                    if (err) {
                        reject(err);
                    }

                    if (row) {
                        resolve("exists");
                    }

                    resolve(false);
                });
            });
        };

        if (userExists == "exists") {
            let sql = "UPDATE tokens SET token = ? WHERE email = ?";
            db.run(sql, [tokenHash, user], (err) => {
                if (err) {
                    reject(err);
                }
                resolve("Token Created");
            });
        } else {
            let sql = "INSERT INTO tokens(email, token) VALUES(?, ?)";
            db.run(sql, [user, tokenHash], (err) => {
                if (err) {
                    reject(err);
                }
                resolve("Token Created");
            });
        }
    });
}

async function verifyToken(email, token) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM tokens WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }

            if (row && bcrypt.compareSync(token, row.token)) {
                resolve("match");
            }

            resolve(false);
        });
    });
}

async function logout(email) {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM tokens WHERE email = ?";
        db.run(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

async function getUser(email) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM users WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

async function getUserbyId(id) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM users WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

module.exports = { getAllUsers, createUser, loginUser, saveToken, verifyToken, logout, getUser, getUserbyId };
