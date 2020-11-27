const Router = require("koa-router");

const auth = require("./auth");
const schedule = require("./schedule");

const router = new Router();

router.use("/auth", auth.routes());
router.use("/schedule", schedule.routes());

module.exports = router;
