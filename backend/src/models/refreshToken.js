import { DataTypes } from "sequelize";


import Sequelize from "../config/db.js";

const refreshToken = Sequelize.define("refreshTokens", {
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
},{
    tableName:"refreshTokens"
})



export default  refreshToken