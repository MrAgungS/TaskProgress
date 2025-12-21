import { DataTypes } from "sequelize";


import Sequelize from "../config/db.js";

const Users = Sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.ENUM("user","admin"),
        defaultValue: "user"
    },
    created_at: {
        type: DataTypes.TIME
    }
})



export default Users