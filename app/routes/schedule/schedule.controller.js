const db = require("../../models");
const Schedule = db.schedule;
const Op = db.Sequelize.Op;

const { checkAndGetUserId } = require("../../utils/auth");
const { timeLater } = require("../../utils/time");

const datePadding = "2018-02-23T";

// Create and Save a new Schedule
exports.create = async (ctx) => {
  const UserId = await checkAndGetUserId(ctx);
  const req = ctx.request;

  if (!req.body.name) {
    ctx.status = 400;
    ctx.body = {
      message: "Content can not be empty!",
    };
    return;
  }

  console.log(req.body);

  const schedule = {
    name: req.body.name,
    shortName: req.body.shortName,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    color: req.body.color,
    UserId: UserId,
  };

  // Check if overlaps with other schedules
  const originalSchedules = await Schedule.findAll({ where: { UserId } });
  let valid = true;
  originalSchedules.map((originalSchedule) => {
    console.log(originalSchedule);
    console.log(schedule);
    if (
      (timeLater(originalSchedule.endTime, schedule.startTime) &&
        timeLater(schedule.startTime, originalSchedule.startTime)) ||
      (timeLater(originalSchedule.startTime, schedule.startTime) &&
        timeLater(schedule.endTime, originalSchedule.startTime))
    )
      valid = false;
  });

  ctx.assert(
    valid,
    400,
    "New schedule overlaps with other schedule. Please check the time of the new schedule."
  );

  // Save Schedule in the database
  await Schedule.create(schedule)
    .then((data) => {
      ctx.body = data;
      console.log("success");
    })
    .catch((err) => {
      console.log("error");
      ctx.status = 500;
      ctx.body = {
        message:
          err.message || "Some error occurred while creating the schedule.",
      };
    });
};

// Retrieve all Schedules corresponding to the current user from the database.
exports.findAll = async (ctx) => {
  const name = ctx.request.query.name;
  const UserId = await checkAndGetUserId(ctx);

  await Schedule.findAll({ where: { UserId } })
    .then((data) => {
      console.log(data);
      ctx.body = data;
    })
    .catch((err) => {
      ctx.status = 500;
      ctx.body = {
        message:
          err.message || "Some error occurred while retrieving schedules.",
      };
    });
};

// Find a single Schedule with an id
exports.findOne = async (ctx) => {
  const req = ctx.request;
  const id = req.params.id;

  await Schedule.findByPk(id)
    .then((data) => {
      ctx.body = data;
    })
    .catch((err) => {
      ctx.status = 500;
      ctx.body = {
        message: "Error retrieving schedule with id=" + id,
      };
    });
};

// Update a Schedule by the id in the request
exports.update = async (ctx) => {
  const req = ctx.request;
  const id = req.params.id;

  await Schedule.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        ctx.body = {
          message: "Schedule was updated successfully.",
        };
      } else {
        ctx.body = {
          message: `Cannot update Schedule with id=${id}. Maybe Schedule was not found or req.body is empty!`,
        };
      }
    })
    .catch((err) => {
      ctx.status = 500;
      ctx.body = {
        message: "Error updating Schedule with id=" + id,
      };
    });
};

// Delete a Schedule with the specified id in the request
exports.delete = async (ctx) => {
  const req = ctx.request;
  const id = req.params.id;

  await Schedule.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        ctx.body = {
          message: "Schedule was deleted successfully!",
        };
      } else {
        ctx.body = {
          message: `Cannot delete Schedule with id=${id}. Maybe Schedule was not found!`,
        };
      }
    })
    .catch((err) => {
      ctx.status = 500;
      ctx.body = {
        message: "Could not delete Schedule with id=" + id,
      };
    });
};

// Delete all Schedules from the database.
exports.deleteAll = async (ctx) => {
  const UserId = await checkAndGetUserId(ctx);

  await Schedule.destroy({
    where: { UserId },
    truncate: false,
  })
    .then((nums) => {
      ctx.body = { message: `${nums} Schedules were deleted successfully!` };
    })
    .catch((err) => {
      ctx.status = 500;
      ctx.body = {
        message:
          err.message || "Some error occurred while removing all schedules.",
      };
    });
};
