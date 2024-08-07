const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
require("dotenv").config();

function index(req, res) {
    res.redirect("/refresh");
}

function login(req, res) {
    const accessToken = req.headers.cookie ? cookie.parse(req.headers.cookie).MY_ACCESS_TOKEN : undefined;
    accessToken == "logIn" ? res.render("login") : res.redirect("/refresh");
}

function signup(req, res) {
    res.render("signup");
}

async function createUser(req, res) {
    const result = await userModel.createUser(req.body);
    res.json(result);
}

async function loginUser(req, res) {
    const result = await userModel.loginUser(req.body);

    if (result.error) {
        res.json(result);
    } else {
        const user = { email: result.email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        const saveToken = await userModel.saveToken(user.email, refreshToken);
        if (saveToken == "Token Created") {
            res.cookie("MY_ACCESS_TOKEN", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000, secure: true, sameSite: "strict" });
            res.cookie("MY_REFRESH_TOKEN", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict", path: ["/refresh", "/logout"] });
            res.json({ accessToken: accessToken });
        } else {
            res.sendStatus(500);
        }
    }
}

function authenticateToken(req, res, next) {
    const accessToken = req.headers.cookie ? cookie.parse(req.headers.cookie).MY_ACCESS_TOKEN : undefined;
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
    const refreshToken = req.headers.cookie ? cookie.parse(req.headers.cookie).MY_REFRESH_TOKEN : undefined;

    if (!refreshToken) {
        res.cookie("MY_ACCESS_TOKEN", "logIn", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict" });
        res.redirect("/login");
    } else {
        const email = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return undefined;
            }
            return user.email;
        });

        if (!email) {
            res.cookie("MY_ACCESS_TOKEN", "logIn", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict" });
            res.clearCookie("MY_REFRESH_TOKEN", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict", path: ["/refresh", "/logout"] });
            res.redirect("/login");
        } else {
            const verifyToken = await userModel.verifyToken(email, refreshToken);

            if (verifyToken == "match") {
                const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                res.cookie("MY_ACCESS_TOKEN", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000, secure: true, sameSite: "strict" });
                res.redirect("/products");
            } else {
                res.cookie("MY_ACCESS_TOKEN", "logIn", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict" });
                res.clearCookie("MY_REFRESH_TOKEN", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict", path: ["/refresh", "/logout"] });
                res.redirect("/login");
            }
        }
    }
}

async function logout(req, res) {
    const refreshToken = req.headers.cookie ? cookie.parse(req.headers.cookie).MY_REFRESH_TOKEN : undefined;
    const accessToken = req.headers.cookie ? cookie.parse(req.headers.cookie).MY_ACCESS_TOKEN : undefined;

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

    res.cookie("MY_ACCESS_TOKEN", "logIn", { httpOnly: true, maxAge: 1000, secure: true, sameSite: "strict" });
    res.clearCookie("MY_REFRESH_TOKEN", "", { httpOnly: true, maxAge: 1000, secure: true, sameSite: "strict", path: ["/refresh", "/logout"] });
    res.render("logout");
}

async function profile(req, res) {
    let user = await userModel.getUserByEmail(req.user.email);
    user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    res.render("profile", { first_name: user.first_name, id: user.id, role: user.role });
}

async function getUser(req, res) {
    let user = await userModel.getUserById(req.params.id);
    user.password = "";
    res.json(user);
}

module.exports = { index, login, signup, createUser, loginUser, authenticateToken, refreshToken, logout, profile, getUser };
