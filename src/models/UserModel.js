const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

let db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.log("Error Occurred - " + err.message);
    } else {
        console.log("Database Connected");
    }
});

function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", [], (err, rows) => {
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
        return { success: "User Found!" };
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

    if (password.length < 8) {
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
        db.all(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
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

// console.log(bcrypt.compareSync(password, passwordHash));
module.exports = { getAllUsers, createUser, loginUser };
