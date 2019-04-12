//const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
const db = require('../db');

module.exports = db.defineModel('tenants', {
    // tenantId: {
    //     type:db.STRING(50),
    //     primaryKey: true,
    //     comment: "自增，主键",
    //     validate:{
    //         initialAutoIncrement: 0,
    //         autoIncrement: true,
    //     }
        
    // },
    sceneModelNum: {
        type:db.INTEGER,
        defaultValue:0
    },
    deviceModelNum: {
        type:db.INTEGER,
        defaultValue:0
    }
});