const Router = require("koa-router");

const user = new Router();

const authCtrl = require("./auth.controller");

user.post("/register", authCtrl.register);
user.post("/login", authCtrl.login);
user.get("/check", authCtrl.check);
user.get("/logout", authCtrl.logout);
user.post("/changePublic", authCtrl.public);
user.post("/chanagePrivate", authCtrl.private);

module.exports = user;
