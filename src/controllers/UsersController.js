const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
require("dotenv").config();

function index(req, res) {
    res.redirect("/products");
}

function login(req, res) {
    res.render("login");
}

function signup(req, res) {
    res.render("signup");
}

async function createUser(req, res) {
    let result = await userModel.createUser(req.body);
    res.json(result);
}

async function loginUser(req, res) {
    let result = await userModel.loginUser(req.body);

    if (result.error) {
        res.json(result);
    } else {
        const user = { email: result.email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        let saveToken = await userModel.saveToken(user.email, refreshToken);
        if (saveToken == "Token Created") {
            res.cookie("MY_ACCESS_TOKEN", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000, secure: true, sameSite: "strict" });
            res.cookie("MY_REFRESH_TOKEN", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict", path: ["/logout", "/refresh"] });
            res.json({ accessToken: accessToken });
        } else {
            res.sendStatus(500);
        }
    }
}

function authenticateToken(req, res, next) {
    const accessToken = cookie.parse(req.headers.cookie).MY_ACCESS_TOKEN;
    if (!accessToken) {
        return res.redirect("/refresh");
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

async function refreshToken(req, res) {
    const refreshToken = cookie.parse(req.headers.cookie).MY_REFRESH_TOKEN;

    if (!refreshToken) {
        res.redirect("/login");
    }

    const email = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return undefined;
        }
        return user.email;
    });

    if (!email) {
        res.redirect("/login");
    }

    const verifyToken = await userModel.verifyToken(email, refreshToken);

    if (verifyToken == "match") {
        const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        res.cookie("MY_ACCESS_TOKEN", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000, secure: true, sameSite: "strict" });
        res.redirect("/products");
    } else {
        res.clearCookie("MY_REFRESH_TOKEN", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict", path: ["/logout", "/refresh"] });
        res.redirect("/login");
    }
}

async function logout(req, res) {
    const refreshToken = cookie.parse(req.headers.cookie).MY_REFRESH_TOKEN;
    const accessToken = cookie.parse(req.headers.cookie).MY_ACCESS_TOKEN;
    let email;

    if (refreshToken) {
        email = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return undefined;
            }
            return user.email;
        });
    }

    if (!email && accessToken) {
        email = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return undefined;
            }
            return user.email;
        });
    }

    if (email) {
        await userModel.logout(email);
    }

    res.cookie("MY_ACCESS_TOKEN", " ", { httpOnly: true, maxAge: 1000, secure: true, sameSite: "strict" });
    res.cookie("MY_REFRESH_TOKEN", " ", { httpOnly: true, maxAge: 1000, secure: true, sameSite: "strict" });
    res.render("logout");
}

async function profile(req, res) {
    let user = await userModel.getUser(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("profile", { first_name: user.first_name, id: user.id, role: user.role });
}

async function getUser(req, res) {
    let user = await userModel.getUserbyId(req.params.id);
    user.password = "";
    res.json(user);
}

module.exports = { index, login, signup, createUser, loginUser, authenticateToken, refreshToken, logout, profile, getUser };
