export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
        },
        role: {
            type: Sequelize.ENUM("user","admin"),
            defaultValue: "user"
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
    },{
        engine: "InnoDB",
    });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
