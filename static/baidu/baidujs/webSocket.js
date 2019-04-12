if ("WebSocket" in window)
            {
               //alert("您的浏览器支持 WebSocket!");               
               // 打开一个 web socket
               //var ws = new WebSocket("ws://39.104.189.84:8800/api/warning/webSocket"); 
               var ws = new WebSocket("ws://139.159.242.107:8800/api/warning/webSocket");                
               ws.onopen = function(evt)
               {
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  var data ={tenantId:tenantId}
                  ws.send(JSON.stringify(data));
               };
                
               ws.onmessage = function (evt) 
               { 
                  console.log(evt)
                  var received_msg = evt.data;
                  if(isJsonString(evt.data))
                  {
                     toastr.info('报警设备：'+JSON.parse(evt.data).deviceId+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'+'报警信息：'+JSON.parse(evt.data).content);
                     //var siteId=122;
                     $.ajax({
                        url: 'api/warning/readWarning/'+JSON.parse(evt.data).id,
                        type: 'get',
                        async : false,
                        dataType: 'json',
                        error:function(){
                            toastr.error('失败');
                        },
                        success: function(req) {
                        }
                     });

                     $.ajax({
                       url:'api/3d815/getDeviceInfo/'+JSON.parse(evt.data).deviceId,
                       type:'get',//提交方式
                       dataType:'JSON',//返回字符串，T大写
                       success: function(req){
                        //console.log(req)
                        if(req.siteId==-1)
                        {
                           toastr.warning('设备没有分配站点，请分配！');
                        }
                        else
                        {
                           $.ajax({
                              url:'/api/sites/'+req.siteId,
                              type:'get',//提交方式
                              dataType:'JSON',//返回字符串，T大写
                              success: function(req){
                                 console.log(req.sites)                          
                                 if(req.sites[0].tenantId==tenantId)
                                 {                            
                                     point=new BMap.Point(req.sites[0].longtitude,req.sites[0].latitude);
                                     map.centerAndZoom(point, 20);
                                     var allOverlay = map.getOverlays();
                                     //console.log(allOverlay)
                                     for (var i = 1; i < allOverlay.length ; i++){                   
                                             //console.log(allOverlay[i].toString())
                                             if(allOverlay[i].toString()=="[object Marker]")
                                             {
                                                 //console.log(allOverlay[i].getLabel())
                                                 if(allOverlay[i].getLabel()!=null)
                                                 {
                                                     if(allOverlay[i].getLabel().content == req.sites[0].id)
                                                     {
                                                         var myIcon = new BMap.Icon(src="../static/baidu/img/008h.gif", new BMap.Size(25, 40), {anchor: new BMap.Size(15, 25), imageOffset: new BMap.Size(0, 0),imageSize:new BMap.Size(30, 30)}); // 指定定位位置  });
                                                         allOverlay[i].setIcon(myIcon);                                                   
                                                     } 
                                                 }                            
                                             }
                                     }
                                 }           
                              },
                              error:function(error)
                              {
                                  toastr.error(error.message);
                              }                       
                           })
                        }                                                                                                    
                       },
                       error:function(error)
                       {
                           toastr.error(error.message);
                       }
                   })                               
                  }                  
               };
                
               ws.onclose = function(evt)
               { 
                  // 关闭 websocket
                  console.log(evt)
                  toastr.warning("webSocket连接已关闭..."); 
               };
            }
            
            else
            {
               // 浏览器不支持 WebSocket
               toastr.warning("您的浏览器不支持 WebSocket!");
            }


function isJsonString(str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
    }