const dModel = require('../services/devicesModel.js');

const APIError = require('../rest').APIError;

module.exports = {
    'POST /api/dModel/createModel/:tenantId/:siteId': async (ctx,next)=>{
        var tid = ctx.params.tenantId;
        var siteId = ctx.params.siteId;
        var body = ctx.request.body;
        var res = await dModel.createModel(tid,siteId,body);

        ctx.rest(res)
    },

    'GET /api/dModel/getSitedModel/:siteId': async (ctx, next) => {  //通过站点Id获取
        var siteId = ctx.params.siteId;
        var res = await dModel.getSitedModel(siteId);     
        ctx.rest({
            dModels: res
        });
    },

    'GET /api/dModel/getSitedModelByDid/:deviceId': async (ctx, next) => {  //通过设备Id获取模型
        var deviceId = ctx.params.deviceId;
        var res = await dModel.getSitedModelByDid(deviceId);     
        ctx.rest({
            dModels: res
        });
    },


    'DELETE /api/dModel/dModelDelete/:deviceId': async (ctx, next) => {   //删除站点dmodel，失败res=0,成功=1
        console.log(`delete dModel ${ctx.params.deviceId}...`);
        var s = await dModel.dModelDelete(ctx.params.deviceId);
        if (s) {
            ctx.rest({
                res:s
            });
        } else {
            throw new APIError('dModel:not_found', 'dModel not found by deviceId.');
        }
    },

    'PUT /api/dModel/dModelRename/:deviceId': async (ctx,next) => {
        var deviceId = ctx.params.deviceId;
        var newname = ctx.request.body.name;
        var s = await dModel.dModelRename(deviceId,newname);
        if (s.res[0] === 1) {
            ctx.rest(s);
        } else {
            throw new APIError('dModel:not_found', 'dModel not found by deviceId.');
        }
    },

    'PUT /api/dModel/dModelUrl/:deviceId': async (ctx,next) => {
        var deviceId = ctx.params.deviceId;
        var dModelUrl = ctx.request.body.url;
        var s = await dModel.dModelUrl(deviceId,dModelUrl);
        if (s.res[0] === 1) {
            ctx.rest({
                res:s
            });
        } else {
            throw new APIError('dModel:not_found', 'dModel not found by deviceId.');
        }
    },

    'PUT /api/dModel/dModelLocation/:deviceId': async (ctx,next) => {
        var deviceId = ctx.params.deviceId;
        var location = ctx.request.body.location;
        var s = await dModel.dModelLocation(deviceId,location);
        if (s.res[0] === 1) {
            ctx.rest(s);
        } else {
            throw new APIError('dModel:not_found', 'dModel not found by deviceId.');
        }
    },

    'PUT /api/dModel/addLabel/:deviceId': async (ctx,next) => {
        var deviceId = ctx.params.deviceId;
        var label = ctx.request.body.label;
        var s = await dModel.addLabel(deviceId,label);
        if (s.res[0] === 1) {
            ctx.rest(s);
        } else {
            throw new APIError('dModel:not_found', 'dModel not found by deviceId.');
        }
    },
    
}