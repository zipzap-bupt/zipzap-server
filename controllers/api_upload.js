const upload = require('../services/upload.js');

const APIError = require('../rest').APIError;

module.exports = {

    'POST /api/uploadScene': async (ctx, next) => {
        
        var files = ctx.request.files;
        var tenantId = ctx.query.tenantId;
        var siteId = ctx.query.siteId;
        
        try{
            var res = await upload.uploadScene(files,'s',tenantId,siteId);
            if (res){
                ctx.rest(res);   
                    
            }else{
                throw new APIError('upload:have no files', 'have no file accepted');
            }
        }catch(e){
            throw new APIError('upload:failed', e.message);
        }
        
        },

    'POST /api/uploadDevice': async (ctx, next) => {
    
        var files = ctx.request.files;
        var tenantId = ctx.query.tenantId;
        var siteId = ctx.query.siteId;
        try{
            var res = await upload.uploadScene(files,'d',tenantId,siteId);
            if (res){
                ctx.rest(res);   
                    
            }else{
                throw new APIError('upload:have no files', 'have no file accepted');
            }
        }catch(e){
            throw new APIError('upload:failed', e.message);
        }
        
        },

};