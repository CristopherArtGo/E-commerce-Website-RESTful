const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
    connectionString: process.env.POSTGRES_URL,
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    port: 5452,
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Database Connected");
});

module.exports = db;
