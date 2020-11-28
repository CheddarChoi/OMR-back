const db = require("../../models");
const Schedule = db.schedule;
const Op = db.Sequelize.Op;

const { checkAndGetUserId } = require("../../utils/auth");

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
    published: req.body.published ? req.body.published : false,
    UserId: UserId,
  };

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

// Retrieve all Schedules from the database.
exports.findAll = async (ctx) => {
  const name = ctx.request.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  await Schedule.findAll({ where: condition })
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
exports.findOne = (req, res) => {
  const id = req.params.id;

  Schedule.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving schedule with id=" + id,
      });
    });
};

// Update a Schedule by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Schedule.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Schedule was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Schedule with id=${id}. Maybe Schedule was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Schedule with id=" + id,
      });
    });
};

// Delete a Schedule with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Schedule.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Schedule was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Schedule with id=${id}. Maybe Schedule was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Schedule with id=" + id,
      });
    });
};

// Delete all Schedules from the database.
exports.deleteAll = (req, res) => {
  Schedule.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Schedules were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all schedules.",
      });
    });
};

// Find all published Schedules
exports.findAllPublished = (req, res) => {
  Schedule.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving schedules.",
      });
    });
};
