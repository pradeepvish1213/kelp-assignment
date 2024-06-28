const {Sequelize} = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, // Disable logging; default: console.log
    pool: {
        max: 20,            // Increase max connections if you have high concurrency
        min: 0,             // Allow Sequelize to close idle connections
        acquire: 30000,     // Timeout for acquiring a connection
        idle: 10000         // Timeout before releasing an idle connection from pool
    }
});

async function checkDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = {checkDatabaseConnection, sequelize}