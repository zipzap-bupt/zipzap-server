const model = require('../database/model');

let devicesModel = model.devicesModel;


function dModel(name,tenantId,deviceId,siteId,location,dModelUrl) {
    this.name = name;
    this.tenantId = tenantId;
    this.deviceId = deviceId;
    this.siteId = siteId;
    this.location = location;
    this.deviceModelUrl = dModelUrl || '';
}

module.exports = {
    createModel: async(tid,siteId,body) => {
        var model = new dModel(body.name,tid,body.deviceId,siteId,body.location,body.dModelUrl);
        var res = await devicesModel.create(model);

        return res;
    },

    getSitedModel: async(siteId) => {
        var res = await devicesModel.findAll({
            where:{
                siteId: siteId
            }
        });
        return res;
    },

    dModelDelete: async(deviceId) => {
        var res = await devicesModel.destroy({
            where: {
                deviceId:deviceId
            }
        });

        return res;
    },

    dModelRename:async(deviceId,name) => {
        var res = await devicesModel.update(
            {
                name:name,
                updatedAt:Date.now(),
            },
            {
                where:{
                    deviceId:deviceId
                }
            });
            
        return {
            res:res,
            newName:name
        };
    },

    dModelUrl:async(deviceId,url) => {
        var res = await devicesModel.update(
            {
                deviceModelUrl:url,
                updatedAt:Date.now(),
            },
            {
                where:{
                    deviceId:deviceId
                }
            });
            
        return {
            res:res,
            newUrl:url
        };
    },

    dModelLocation:async(deviceId,location) => {
        var res = await devicesModel.update(
            {
                location:location,
                updatedAt:Date.now(),
            },
            {
                where:{
                    deviceId:deviceId
                }
            });
            
        return {
            res:res,
            newLocation:location
        };
    },

    addLabel:async(deviceId,label) => {
        var res = await devicesModel.update(
            {
                label:label,
                updatedAt:Date.now(),
            },
            {
                where:{
                    deviceId:deviceId
                }
            });
            
        return {
            res:res,
            newLabel:label
        };
    },

    getSitedModelByDid:async(deviceId) => {
        var res = await devicesModel.findAll({
            where:{
                deviceId: deviceId
            }
        });
        return res;
    },
}