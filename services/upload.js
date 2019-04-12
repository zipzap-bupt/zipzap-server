const fs = require('fs');
const path = require('path');
const moment = require('moment');
const uuid = require('uuid');
const fileCopy = require('./copy-files-stream');

function generateId() {
    
    return uuid.v1();   //根据时间戳生成id
}

module.exports = {

    uploadScene: async (files,which,tenantId,siteId) => {

        if((tenantId === undefined || tenantId === "") || (siteId === undefined || siteId === "")){
            throw new Error("无法鉴别租户或站点，没有权限上传！");
        }

        if(files.length>0){  
            for(var item of files){  
                
                var tmpath = item.path;  
                if (which === 's'){
                    var tenantPath = "public/upload/scenes/"+tenantId+"/";
                    var tenantSitePath = "public/upload/scenes/"+tenantId+"/"+siteId+"/";
                    var fileFullPath = "public/upload/scenes/"+tenantId+"/"+siteId+"/" + "~"+item.name;

                    if(!fs.existsSync(tenantSitePath)){
                        if(!fs.existsSync(tenantPath)){
                            fs.mkdirSync(tenantPath);
                            fs.mkdirSync(tenantSitePath);
                        }else{
                                fs.mkdirSync(tenantSitePath);
                            }              
                    }

                    if(fs.existsSync(fileFullPath)){
                        
                        throw new Error("文件已经存在！请不要重复上传");
                        
                    }
                    
                    var newpath =path.join('public/upload/scenes/'+tenantId+'/'+siteId, '~'+item.name);  
                }else if(which === 'd'){
                    var tenantPath = "public/upload/devices/"+tenantId+"/";
                    var tenantSitePath = "public/upload/devices/"+tenantId+"/"+siteId+"/";
                    var fileFullPath = "public/upload/devices/"+tenantId+"/"+siteId+"/" + "~"+item.name;
                    
                    if(!fs.existsSync(tenantSitePath)){
                        if(!fs.existsSync(tenantPath)){
                            fs.mkdirSync(tenantPath);
                            fs.mkdirSync(tenantSitePath);
                        }else{
                                fs.mkdirSync(tenantSitePath);
                            }              
                    }

                    if(fs.existsSync(fileFullPath)){
                        
                        throw new Error("文件已经存在！请不要重复上传");
                        
                    }
                
                    var newpath =path.join('public/upload/devices/'+tenantId+'/'+siteId, '~'+item.name); 
                }
                console.log(newpath); 
                const defaults = {
                    flags: 'a+',
                    encoding: 'utf8',
                    fd: null,
                    mode: 0o666,
                    autoClose: true
                    };
                try{
                await fileCopy(tmpath,newpath,defaults);
                }catch(e){
                    throw new Error('文件上传失败！'+e.message);
                }
            } 
            var time = moment().format();
            var resData = {
                uploadTime:time,
                res:"success",
                url:newpath,
            }
            
            return resData;
        }else{
            return null;
        }  
    },

};