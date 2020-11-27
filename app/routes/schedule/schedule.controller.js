const db = require("../../../models");
const Schedule = db.schedules;
const Op = db.Sequelize.Op;

// Create and Save a new Schedule
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Schedule
  const schedule = {
    name: req.body.name,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    published: req.body.published ? req.body.published : false,
  };

  // Save Schedule in the database
  Schedule.create(schedule)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the schedule.",
      });
    });
};

// Retrieve all Schedules from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Schedule.findAll({ where: condition })
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
