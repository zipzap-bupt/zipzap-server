// // store products as database:
// //在这里操作数据库拿数据
// //对一张表的所有操作都写在这一个js中


// const model = require('../database/model');

// let Scene = model.Scene;


// function Scenes(name,tenantId) {
//     this.name = name;
//     this.tenantId = tenantId;
// }

// // var products = [
// //     new Product('iPhone 7', 'Apple', 6800),
// //     new Product('ThinkPad T440', 'Lenovo', 5999),
// //     new Product('LBP2900', 'Canon', 1099)
// // ];

// module.exports = {
//     getScenes: async () => {
//         var scenes = await Scene.findAll();              //这里可以调用数据库操作方法
       
//         return scenes;     //async函数return的时候会返回一个promise对象
//     },


//     getSceneById: async (id) => {
        
//         var scene = await Scene.findAll({
//             where:{
//                 id: id
//             }
//         });
        
//         return scene;
//     },

//     getSceneByTenentId: async (id) => {
        
//         var scene = await Scene.findAll({
//             where:{
//                 tenantId: id
//             }
//         });
       
        
//         return scene;
//     },

//     getSceneByName: async (name) => {
        
//         var scene = await Scene.findAll({
//             where:{
//                 name: name
//             }
//         });
        
        
//         return scene;
//     },

//     createScene: async (name, tenantId) => {
        
//         var s = new Scenes(name,tenantId);
//         var scene = await Scene.create(s);
        
//         return scene;
//     },

//     deleteScene: async (id) => {
        
//         var scene = await Scene.destroy({
//             where: {
//                 id:id
//             }
//         });
//         console.log(scene);    //删除成功返回1，失败返回0

//         return scene;
//     },

//     renameScene: async (id,name) => {
        
//         var scene = await Scene.update(
//             {
//                 name:name,
//                 updateAt:Date.now(),
//                 // version:version++
//             },
//             {
//                 where: {
//                 id:id
//                 }
//         }
//         );     //返回一个一维数组，表示每个更新的失败或成功，0表示失败，1表示成功
        
//         console.log(scene);    //删除成功返回1，失败返回0

//         return scene;
//     },

//     // getSites: async () => {
//     //     var sites = await Site.findAll({
//     //         // 'attributes': ['id', 'name','longtitude','updatedAt']
//     //     });              //这里可以调用数据库操作方法
//     //     console.log(JSON.stringify(sites));
        
//     //     //db.createItem();
       
//     //     return sites;     //async函数return的时候会返回一个promise对象
//     // },
// };
