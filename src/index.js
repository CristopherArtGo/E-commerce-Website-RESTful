const express = require("express");
const app = express();
const path = require("path");
const PORT = 8000;
const router = require("./routes");

app.use(express.static(path.join(__dirname, "/assets")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

module.exports = app;