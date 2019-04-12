
const auth = require('../services/auth.js');

const APIError = require('../rest').APIError;

module.exports = {

    'POST /api/login': async (ctx, next) => {     
        
        var res = await auth.login(ctx.request.body.username, ctx.request.body.password);
        
        ctx.rest(res);
    },

    

    /*  参数：即url后面/:id部分，一个/test/中间只有一个参数，？后面接的是query串，在ctx.query里面
       可以拿到url中的query参数和值。*/
    // 'GET /api/test/:id': async (ctx,next) =>{
    //     var id = ctx.params.id;
    //     var name = ctx.query.name;
        
    //     console.log(id+' '+name);
    // },

};
