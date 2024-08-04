const model = require("../models/UserModel");

function index(req, res) {
    res.render("index");
}

function signup(req, res) {
    res.render("signup");
}

async function createUser(req, res) {
    let result = await model.createUser(req.body);
    res.json(result);
}

async function loginUser(req, res) {
    let result = await model.loginUser(req.body);
    res.json(result);
}

module.exports = { index, signup, createUser, loginUser };
