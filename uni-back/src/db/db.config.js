// @TODO: разобраться с работой sequelize + typescript

const DB_CONFIG = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: process.env.DB_DIALECT,
  migrationStorageTableName: '_migrations_',
  define: {
    schema: 'public',
    underscored: true,
  },
  seederStorageTableName: '_seeders_',
  seederStorage: 'sequelize',
};

module.exports = {
  development: DB_CONFIG,
  test: DB_CONFIG,
  production: DB_CONFIG,
};
