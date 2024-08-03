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
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });
}

async function createUser(user) {
    try {
        let inputErrors = validateSignup(user);

        if (inputErrors) {
            throw inputErrors;
        }

        let { first_name, last_name, email, password } = user;

        let currentTime = new Date().toISOString();
        let passwordHash = bcrypt.hashSync(password, 10);
        let sql = "INSERT INTO users(first_name, last_name, email, password, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)";

        db.run(sql, [first_name, last_name, email, passwordHash, currentTime, currentTime], (err) => {
            if (err) {
                throw err.message;
            }
        });
    } catch (error) {
        return error;
    }
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

// console.log(bcrypt.compareSync(password, passwordHash));
module.exports = { getAllUsers, createUser };
