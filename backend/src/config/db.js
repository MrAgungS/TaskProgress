import sequelize  from "sequelize"
import dotenv from "dotenv"


dotenv.config()

const Sequelize = new sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql"
    }
)

export default Sequelize