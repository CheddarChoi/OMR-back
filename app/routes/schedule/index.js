module.exports = (app) => {
  const schedules = require("../controllers/schedule.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", schedules.create);

  // Retrieve all schedules
  router.get("/", schedules.findAll);

  // Retrieve all published schedules
  router.get("/published", schedules.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", schedules.findOne);

  // Update a Tutorial with id
  router.put("/:id", schedules.update);

  // Delete a Tutorial with id
  router.delete("/:id", schedules.delete);

  // Delete all schedules
  router.delete("/", schedules.deleteAll);

  app.use("/api/schedules", router);
};
