const userModel = require("../models/UserModel");

async function checkRole(req, res, next) {
    const email = req.user.email;
    let user = await userModel.getUser(email);
    if (user) {
        req.user.role = user.is_admin;
        next();
    } else {
        res.redirect("/logout");
    }
}

async function adminDashboard(req, res) {
    let user = await userModel.getUser(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("adminDashboard", { first_name: user.first_name, role: req.user.role });
}

function filterUser(req, res, next) {
    console.log(req.user.role);
    if (req.user.role) {
        next();
    } else {
        res.redirect("/products");
    }
}

module.exports = { checkRole, adminDashboard, filterUser };
