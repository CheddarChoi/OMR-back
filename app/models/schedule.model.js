module.exports = (sequelize, Sequelize) => {
  const Schedule = sequelize.define("schedule", {
    name: {
      type: Sequelize.STRING,
    },
    startTime: {
      type: Sequelize.TIME,
    },
    endTime: {
      type: Sequelize.TIME,
    },
    published: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Schedule;
};
