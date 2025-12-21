import { DataTypes } from "sequelize";


import Sequelize from "../config/db.js";

const refreshToken = Sequelize.define("refreshToken", {
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
})



export default  refreshToken