const axios = require('axios');
const request = require('superagent');

var instance = axios.create({
    baseURL: 'http://deviceaccess:8100/api/v1/deviceaccess',
    // timeout: 60000,
  });

global.requestId = 100000;

function getDeviceId(id){
    var deviceId;
    switch (id){
        case 'uid1':
            deviceId = "1ecde350-6252-11e8-b8df-59c2cc02320f";  //switch1
            break;
        case 'uid2':
            deviceId = "1edd2590-6252-11e8-b8df-59c2cc02320f";  //switch2  不可用
            break;
        case 'uid3':
            deviceId = "22acf240-6252-11e8-b8df-59c2cc02320f";  //c1
            break;
        case 'uid4':
            deviceId = "21b94370-6252-11e8-b8df-59c2cc02320f";  //wenshi
            break;
        case 'uid5':
            deviceId = "22649ea0-6252-11e8-b8df-59c2cc02320f";   //c2  不可用
            break;
        default:
            deviceId = null;
    }
    return deviceId;
}

module.exports = {
  
    searchByText:async (tid,sText,limit,access_token)=>{
        var data =await instance.get('/tenant/devices/'+tid+'?limit='+limit+'&textSearch='+sText,{
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });

        return data.data;
        console.log(data.data);
    },

    getDeviceData: async (id,access_token)=>{
        var deviceId = getDeviceId(id);
        var data = await instance.get('/data/alllatestdata/'+deviceId,{
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });
        var yaoce = data.data

        return yaoce;
    },

    devicesPaging: async (tid,limit,idOffset,textOffset,access_token) => {
        try{
            if ((idOffset) || (textOffset)){
            var data = await instance.get('/tenant/devices/'+tid+'?limit='+limit+'&idOffset='+idOffset+'&textOffset='+textOffset,{
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                }
            });
            var res = data.data;

            }else if (!(idOffset) && !(textOffset)){
                var data = await instance.get('/tenant/devices/'+tid+'?limit='+limit,{
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                    }
                });
                var res = data.data;
            }
            return res;
        }catch(e){
            throw e;
        }
    },

    getDeviceInfo: async (id,access_token) => {     //获取设备属性信息
        try{
            var data = await instance.get('/device/'+id,{
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                }
            });
            var info = data.data;

            return info;
        }catch(e){
            throw e;
        }
    },

    siteDevicesPaging: async (tid,siteId,limit,idOffset,textOffset,access_token) => {
        try{
            if ((idOffset) && (textOffset)){
            var data = await instance.get('/sitedevices/'+tid+'/'+siteId+'?limit='+limit+'&idOffset='+idOffset+'&textOffset='+textOffset,{
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                }
            });
            var res = data.data;

            }else if (!(idOffset) && !(textOffset)){
                var data = await instance.get('/sitedevices/'+tid+'/'+siteId+'?limit='+limit,{
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                    }
                });
                var res = data.data;
            }
            return res;
        }catch(e){
            throw e;
        }
    },

    siteDevicesSearch: async (tid,siteId,limit,textSearch,access_token) => {   //待定,底层接口有问题
        try{
            var data = await instance.get('/sitedevices/'+tid+'/'+siteId+'?limit='+limit+'&textSearch='+textSearch,{
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                }
            });
            var res = data.data;
     
            return res;
        }catch(e){
            throw e;
        }
    },


    assignDevicetoSite: async(id,siteId,access_token) =>{
        try{
            var res = await request.put('http://deviceaccess:8100/api/v1/deviceaccess/device')
                .set('Content-Type', 'application/json')
                .set('Authorization','Bearer '+access_token)
                .send({"id":id})
                .send({"siteId":siteId})
                .timeout({
                    response: 5000,
                    deadline: 10000,
                });

            if (res.text){
                return res.text;
            }else{
                throw new Error('server error!');
            }
        }catch(e){
            throw e;
        }

    }
    

}