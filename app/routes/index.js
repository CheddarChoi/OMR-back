const Router = require("koa-router");

const auth = require("./auth");

const router = new Router();

router.use("/auth", auth.routes());

module.exports = router;
