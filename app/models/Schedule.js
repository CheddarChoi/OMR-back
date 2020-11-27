module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("schedule", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.TIME,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    published: {
      type: DataTypes.BOOLEAN,
    },
  });
  Schedule.associate = function (models) {
    // associations can be defined here
    Schedule.belongsTo(models.User);
  };

  return Schedule;
};
