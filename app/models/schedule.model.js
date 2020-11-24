module.exports = (sequelize, Sequelize) => {
  const Schedule = sequelize.define("schedule", {
    name: {
      type: Sequelize.STRING,
    },
    time: {
      type: Sequelize.STRING,
    },
    published: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Schedule;
};
