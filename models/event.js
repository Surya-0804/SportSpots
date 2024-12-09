// models/event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Event;
};
