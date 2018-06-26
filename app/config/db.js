const Sequelize = require('sequelize');
require('../../env');
const {db} = require('../../.env.toml');

const sequelize = new Sequelize(
    db.database,
    db.username,
    db.password,
    {
        dialect: 'mysql',
        host:db.host,
        port:db.port,
        pool: {
            max: 5,
            min: 0,
            idle: 30000
        },
        define: {
            timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
        }
    }
    );

module.exports = sequelize;
