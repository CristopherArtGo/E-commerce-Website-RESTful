const model = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
require("dotenv").config();

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

    if (result.error) {
        res.json(result);
    } else {
        const user = { email: result.email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10s" });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        let saveToken = await model.saveToken(user.email, refreshToken);
        if (saveToken == "Token Created") {
            res.cookie("MY_ACCESS_TOKEN", accessToken, { httpOnly: true, maxAge: 10 * 1000, secure: true, sameSite: "strict" });
            res.cookie("MY_REFRESH_TOKEN", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: "strict", path: "/refresh" });
            res.json({ accessToken: accessToken });
        } else {
            res.sendStatus(500);
        }
    }
}

function dashboard(req, res) {
    res.send(req.user);
}

function authenticateToken(req, res, next) {
    const token = cookie.parse(req.headers.cookie).MY_ACCESS_TOKEN;
    if (!token) {
        return res.redirect("/refresh");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
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

    const verifyToken = await model.verifyToken(email, refreshToken);

    if (verifyToken) {
        const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10s" });
        res.cookie("MY_ACCESS_TOKEN", accessToken, { httpOnly: true, maxAge: 10 * 1000, secure: true, sameSite: "strict" });
        console.log("refreshed");
        res.redirect("/dashboard");
    } else {
        res.redirect("/login");
    }
}

module.exports = { index, signup, createUser, loginUser, dashboard, authenticateToken, refreshToken };
