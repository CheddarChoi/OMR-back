module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("schedule", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      foreignKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    shortName: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.TIME,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    color: {
      type: DataTypes.STRING,
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
