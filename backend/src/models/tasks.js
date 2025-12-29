import { DataTypes } from "sequelize";


import Sequelize from "../config/db.js";

const Tasks = Sequelize.define("tasks", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM("todo","progress","done"),
        defaultValue: "todo"
    },
    priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
    },
    due_date:{
        type: DataTypes.DATE,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
},{
    timestamps: false
})



export default Tasks