//const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
const db = require('../db');

module.exports = db.defineModel('sites', {
    // tenantId: {
    //     type:db.STRING(50),
    //     primaryKey: true,
    //     comment: "自增，主键",
    //     validate:{
    //         initialAutoIncrement: 0,
    //         autoIncrement: true,
    //     }
        
    // },
    tenantId: db.INTEGER,
    name: db.STRING(50),
    longtitude: {
        type:db.DOUBLE,
        defaultValue:0.000000
    },
    latitude: {
        type:db.DOUBLE,
        defaultValue:0.000000
    },
    
    sceneUrl: {
        type: db.STRING(100),
        allowNull : true
    },
    compressStatus:{
        type: db.BOOLEAN,
        comment:"compressed or not",
        defaultValue: false
    },
    ossStatus: {
        type: db.BOOLEAN,
        comment:"toOSS or not",
        defaultValue: false
    },
    devicesModelCount: {
        type: db.INTEGER,
        defaultValue: 0
    },
    sceneModelLoca: {
        type:db.STRING(300),
        allowNull : true
    }
});