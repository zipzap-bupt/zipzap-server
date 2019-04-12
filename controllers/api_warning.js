//处理rest相关的URL
//在这里数据库返回的数据返给前端，放在.rest({})里面  
//对于不同表的api接口操作，就在controllers下面建不同的api.js文件

const warning = require('../services/warning.js');

const APIError = require('../rest').APIError;

module.exports = {
    
    'POST /api/warning/createWarning/:tenantId/:deviceId': async (ctx, next) => {     //创建新警报
        try{
            var tenantId = ctx.params.tenantId;
            var deviceId = ctx.params.deviceId;
            var content = JSON.stringify(ctx.request.body);
            var res = await warning.createWarning(tenantId, deviceId,content);
            var ws = await warning.pushToWs(res.id,tenantId,deviceId,content);

            ctx.rest(res);
        }catch(e){
            throw new APIError('warning: failed','create new warning failed!' + e.message);
        } 
    },

    'GET /api/warning/getWarning/:tenantId/:deviceId': async (ctx, next) => {
        try{
            var tenantId = ctx.params.tenantId;
            var deviceId = ctx.params.deviceId;
        
            var res = await warning.getWarning(tenantId,deviceId);    
            ctx.rest(res);
        }catch(e){
            throw new APIError('warning: failed','get warning failed!' + e.message);
        }
        
    },

    'GET /api/warning/getTenantWarning/:tenantId': async (ctx, next) => {
        try{
            var tenantId = ctx.params.tenantId;
        
            var res = await warning.getTenantWarning(tenantId);    
            ctx.rest(res);
        }catch(e){
            throw new APIError('warning: failed','get warning failed!' + e.message);
        }
        
    },

    'GET /api/warning/readWarning/:id': async(ctx,next) => {
        try{
            var id = ctx.params.id;
            var res = await warning.readWarning(id);

            ctx.rest(res);
        }catch(e){
            throw new APIError('warning: failed','read the warning failed!' + e.message);
        }

    }

};
