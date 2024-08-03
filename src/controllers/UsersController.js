const model = require("../models/UserModel");

function index(req, res) {
    res.render("index");
}

function signup(req, res) {
    let errors;
    let message;
    if (req.session.flash) {
        req.session.flash.signupErrors ? (errors = req.session.flash.signupErrors) : false;
        req.session.flash.successMessage ? (message = req.session.flash.successMessage) : false;
    }
    res.render("signup", { errors: errors, message: message });
}

async function createUser(req, res) {
    let result = await model.createUser(req.body);

    if (result) {
        //render errors
        req.flash("signupErrors", result);
    } else {
        req.flash("successMessage", "User Created Successfuly");
    }
    // console.log(req.session.flash);
    res.redirect("/signup");
}

// async function loginUser(req, res) {
//     let result = await model.loginUser(req.body);
// }

module.exports = { index, signup, createUser };
