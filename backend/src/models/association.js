import Sequelize from "../config/db.js";

import Users from "./users.js";
import Tasks from "./tasks.js";
import refreshToken from "./refreshToken.js";

// USER to TASK
Users.hasMany(Tasks, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Tasks.belongsTo(Users, {
  foreignKey: "user_id",
});

// USER to REFRESH TOKEN
Users.hasMany(refreshToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
refreshToken.belongsTo(Users, {
  foreignKey: "user_id",
});

export {Sequelize, Users, Tasks, refreshToken}