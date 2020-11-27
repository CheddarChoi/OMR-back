const Router = require("koa-router");

const schedule = new Router();

const schedulesCtrl = require("./schedule.controller");

schedule.post("/", schedulesCtrl.create);
schedule.get("/list", schedulesCtrl.findAll);
schedule.get("/published", schedulesCtrl.findAllPublished);
schedule.get("/:id", schedulesCtrl.findOne);
schedule.put("/:id", schedulesCtrl.update);
schedule.delete("/:id", schedulesCtrl.delete);
schedule.delete("/", schedulesCtrl.deleteAll);

module.exports = schedule;
