const express = require("express");
const app = express();
const path = require("path");
const PORT = 8000;
const router = require("./routes");
const session = require("express-session");
const flash = require("express-flash");

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    session({
        secret: "someSecret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 600000 },
    })
);
app.use(flash());
app.use("/", router);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
