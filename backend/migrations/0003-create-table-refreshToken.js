export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("refreshTokens", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        token: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
            model: "users",
            key: "id",
            },
            onDelete: "CASCADE",
        },
        expiresAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    });

}

export async function down(queryInterface) {
  await queryInterface.dropTable("refreshTokens");
}
