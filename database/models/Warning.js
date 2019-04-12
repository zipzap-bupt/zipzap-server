const db = require('../db');

module.exports = db.defineModel('warning', {
    
    tenantId: db.INTEGER,
    
    deviceId:db.STRING(50),   
    
    content:db.STRING(500),

    status:{
        type: db.BOOLEAN,
        defaultValue: true   //true表示还没有阅读，false表示阅读过
    }
});