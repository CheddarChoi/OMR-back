const Router = require("koa-router");

const schedule = new Router();

const schedulesCtrl = require("./schedule.controller");

schedule.post("/", schedulesCtrl.create);
schedule.get("/", schedulesCtrl.findAll);
schedule.get("/:id", schedulesCtrl.findOne);
schedule.get("/getByUser/:userid", schedulesCtrl.findByUser);
schedule.put("/:id", schedulesCtrl.update);
schedule.delete("/:id", schedulesCtrl.delete);
schedule.delete("/", schedulesCtrl.deleteAll);

module.exports = schedule;
