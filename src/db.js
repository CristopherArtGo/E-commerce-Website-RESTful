const sqlite3 = require("sqlite3");

let db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.log("Error Occurred - " + err.message);
    } else {
        console.log("Database Connected");
    }
});

module.exports = db;
