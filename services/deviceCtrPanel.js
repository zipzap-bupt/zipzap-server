const axios = require('axios');
const request = require('superagent');

var instance_access = axios.create({
    baseURL: 'http://deviceaccess:8100/api/v1',
    timeout: 10000,
  });

var instance_service = axios.create({
    baseURL: 'http://servicemanagement:8000/api/v1',
    timeout: 10000,
  });


global.requestId = 100000;

module.exports = {  

    getAllDeviceAttr: async (deviceId,access_token) => {     //获取设备所有属性信息
        try{
            var token = 'Bearer '+access_token;
            var res = await request.get('http://deviceaccess:8100/api/v1/deviceaccess/allattributes/'+deviceId)
                .set('Authorization',token)
                .timeout({
                    response: 5000,
                    deadline: 10000,
                })
                // .end((err,res)=>{
                //     if(err){
                //         console.log(err);
                //     }else{
                //         console.log(res.text);
                //     }
                // });
            

            return res.text;
        }catch(e){
            throw e;
        }
    },

    getCtrPanel: async (manufacturerName,deviceTypeName,modelName,access_token) => {     //获取设备所有属性信息
        try{
            var data = await instance_service.get('/servicemanagement/ability/'+manufacturerName+'/'+deviceTypeName+'/'+modelName,{
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

    sendControl: async (deviceId,body,access_token)=>{

        try{
            if(requestId < 10){
                global.requestId = 100000;
            }
            requestId--;
            
            var res = await request.post('http://deviceaccess:8100/api/v1/deviceaccess/rpc/'+deviceId+'/'+requestId)
                .set('Content-Type', 'application/json; charset=utf-8')
                .set('Authorization','Bearer '+access_token)
                .send(body)
                .timeout({
                    response: 5000,
                    deadline: 10000,
                });
            
            console.log(res.text);
            if (res.text.indexOf("de")!=-1){
                //调用失败
                return "device is offline" + res.text;
            }

            return res.text;
            
        } catch(e){
            throw e;
        }
    },

    //历史数据展示使用
    getAllKeys: async (deviceId,access_token) => {     //获取设备主键
        try{
            var data = await instance_access.get('/deviceaccess/data/allKeys/'+deviceId,{
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

    getHistoricalData: async (deviceId,newSearch,access_token) => {     //获取设备历史数据
        try{
            var data = await instance_access.get('/deviceaccess/data/alldata/'+deviceId+newSearch,{
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
        

}