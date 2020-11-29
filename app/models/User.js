module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      public: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
      timestamps: false,
      defaultScope: {
        attributes: { exclude: ["username", "password", "salt"] },
      },
    }
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Schedule);
  };

  return User;
};
