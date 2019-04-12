// //require，通过db内置方法构建数据模型

// const db = require('../db');

// module.exports = db.defineModel('scenes', {     //第一个参数是表名
    
//     // sceneId: {
//     //         type:db.STRING(50),
//     //         primaryKey: true,
//     //         comment: "主键，自增",
//     //         // validate:{
//     //         //     initialAutoIncrement: 0,
//     //         //     autoIncrement: true
//     //         // }
//     // },
//     tenantId: db.INTEGER,    //即租户ID
//     name: db.STRING(50),
//     sceneUrl: {
//         type: db.STRING(100),
//         allowNull : true
//     },
//     compressStatus:{
//         type: db.BOOLEAN,
//         comment:"compressed or not",
//         defaultValue: false
//     },
//     ossStatus: {
//         type: db.BOOLEAN,
//         comment:"toOSS or not",
//         defaultValue: false
//     },
//     devicesModelCount: {
//         type: db.INTEGER,
//         defaultValue: 0
//     },
//     siteId :{
//         type:db.INTEGER,
//         defaultValue: 0
//     }
// });

// //以上三个是我自己定义的属性，id,createdAt,updatedAt,version是由model定义时自动添加的属性
