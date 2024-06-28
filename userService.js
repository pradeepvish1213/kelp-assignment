const {Model, DataTypes} = require('sequelize');
const {sequelize} = require('./dbConnection');

class User extends Model {
}

User.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    address: DataTypes.JSONB,
    additional_info: DataTypes.JSONB,
}, {sequelize, modelName: 'user', timestamps: false});

const BATCH_SIZE = 10000; // Adjust batch size as needed

const formatRecords = (records) => {
    return records.map(record => {
        const name = `${record.name.firstName} ${record.name.lastName}`;
        const age = parseInt(record.age, 10);
        const address = {
            line1: record.address.line1,
            line2: record.address.line2,
            city: record.address.city,
            state: record.address.state,
        };

        const additionalInfo = {...record};
        delete additionalInfo.name;
        delete additionalInfo.age;
        delete additionalInfo.address;

        return {
            name,
            age,
            address,
            additional_info: additionalInfo
        };
    });
};

const insertBatch = async (batch) => {
    const formattedRecords = formatRecords(batch);
    await sequelize.transaction(async (t) => {
        await User.bulkCreate(formattedRecords, {transaction: t});
    });
};

const processRecordsInBatches = async (records) => {
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        await insertBatch(batch);
    }
};

const findAllUsers = () => {
    return User.findAll({raw: true})
}

module.exports = {insertRecords: processRecordsInBatches, findAllUsers}