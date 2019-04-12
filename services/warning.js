const model = require('../database/model');


let Warning = model.Warning;


function newWsWarning(id,tenantId,deviceId,content) {
    this.id = id;
    this.tenantId = tenantId;
    this.deviceId = deviceId;
    this.content = content;
}
function newWarning(tenantId,deviceId,content) {
    this.tenantId = tenantId;
    this.deviceId = deviceId;
    this.content = content;
}

module.exports = {
    createWarning: async (tenantId,deviceId,content) => {

        try{
            var warnObj = new newWarning(tenantId,deviceId,content);
            var warning = await Warning.create(warnObj);
        
            return warning;
        }catch(e){
            throw e;
        }

    },

    pushToWs:async (id,tenantId,deviceId,content) => {
        try{
            var warnObj = new newWsWarning(id,tenantId,deviceId,content);
            var data = JSON.stringify(warnObj);

            var wss = global.wss;
            wss.pushMessage(tenantId,data);
        }catch(e){
            throw e;
        }

    },

    getWarning: async (tenantId,deviceId) => {

        try{
            var res = await Warning.findAll({
                where:{
                    tenantId: tenantId,
                    deviceId: deviceId,
                    status:true
                }
            });
            return res;
        
        }catch(e){
            throw e;
        }

    },

    getTenantWarning: async (tenantId) => {

        try{
            var res = await Warning.findAll({
                where:{
                    tenantId: tenantId,
                    status:true
                }
            });
            return res;
        
        }catch(e){
            throw e;
        }

    },

    readWarning: async (id) => {
        try{
            var res = await Warning.update(
                {
                    status:false,
                    updatedAt:Date.now(),
                },
                {
                    where:{
                        id:id
                    }
                });
            
            if(res[0] === 1){
                return {
                    status:false,
                    message:"报警信息已阅读"
                };
            }else{
                return {
                    status:true,
                    message:"报警信息未阅读"
                }
            }
            
        }catch(e){
            throw e;
        }
    }
};


