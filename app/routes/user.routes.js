module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.post("/register", users.register);
  router.post("/login", users.login);
  router.get("/check", users.check);
  router.get("/logout", users.logout);

  app.use("/api/users", router);
};
