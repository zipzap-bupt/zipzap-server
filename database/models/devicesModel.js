//const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
const db = require('../db');

module.exports = db.defineModel('devicesmodel', {
    // deviceModelId: {
    //     type:db.STRING(50),
    //     primaryKey: true,
    //     comment: "自增，主键",
    //     validate:{
    //         initialAutoIncrement: 0,
    //         autoIncrement: true,
    //     }
        
    // },
    tenantId: db.INTEGER,
    deviceId: {
        type: db.STRING(50),
        unique: true
    },
    name: db.STRING(50),
    siteId:db.INTEGER,   //外键
    deviceModelUrl: db.STRING(100),
    compressStatus: {
        type: db.BOOLEAN,
        comment:"compressed or not",
        defaultValue: false
    },
    ossStatus: {
        type: db.BOOLEAN,
        comment:"toOSS or not",
        defaultValue: false
    },
    location: {
        type:db.STRING(300),//存设备模型坐标信息，xyz
    },    
    label: {
        type:db.TEXT,
        allowNull: true
    }
});