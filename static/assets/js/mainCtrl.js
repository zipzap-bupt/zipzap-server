
// $("#_deviceDetail").load("static/assets/html/deviceDetail.html");

var mainApp = angular.module("mainApp",["ngResource"]);

mainApp.controller("mainCtrl",["$scope","$resource",function($scope,$resource){

     //===============当前站点所有设备模型对应deviceID集合(数组)==========
     var dModelDeviceId = new Array();
     $(document).ready(function(){
         //==================当前场景设备模型数量============
            $scope.dModelNum = objects.length;
        //=======================end======================
        
        objects.forEach(element => {
            dModelDeviceId.push(element.deviceId);
        });
        console.log(dModelDeviceId);

     });    

     $scope.checkModel = function(data){
         var check = $.inArray(data.id,dModelDeviceId);
         if(check === -1){
            return false;
         }else{
             return true;
         }
         
     }

    //===================================================

//============设备列表动画============
    jQuery("#searchDevice").on("focus",function(){
        jQuery("#searchDeviceDiv").css("opacity","1");
    });
    jQuery("#searchDevice").on("blur",function(){
        jQuery("#searchDeviceDiv").css("opacity","0.2");
    });
    jQuery("#allDevice").mouseover(function(){
        jQuery("#allDevice").css({"background-color":"rgba(49, 47, 47, 1)","color":"#5087c3"});
        jQuery(".button").css("opacity","1");
    });
    jQuery("#allDevice").mouseout(function(){
        jQuery("#allDevice").css({"background-color":"rgba(255,255,255,0.1)","color":"#305680"});
        jQuery(".button").css("opacity","0.2");
    });

/*动态显示左侧箭头
    jQuery("#arrow").mouseover(function(){
        jQuery("#arrow").css({"margin-left":"-10px"});
    })
    jQuery("#arrow").mouseout(function(){
        jQuery("#arrow").css({"margin-left":"-60px"});
    })
    jQuery('#arrow').css({'display':'none'});

*/

    //显示初始化
    jQuery('#showDeviceInfo').css({'display':'none'});
    jQuery('#addModel').css({'display':'none'});
    jQuery('#backList').css({'display':'none'});
    jQuery('#updatePosition').css({'display':'none'});
    jQuery('#menu').css({'display':'none'});




    jQuery("#searchBanner").animate({width:"10px"},500);//初始隐藏搜索框
    jQuery("#iconSpan").css("display","none");
    jQuery("#searchDeviceDiv").css("display","none");
    //jQuery("#searchDeviceDiv").css({width:"0"});
    //jQuery("#searchDeviceDiv").css("opacity","0.2");
    //jQuery("#arrow").animate({width:'0'},400);
    jQuery("#arrow").animate({width:"0"},200);//初始隐藏导航栏
    jQuery(".active").css('display','none');

//==================================
$scope.changeIcon = function(){
    
    if(jQuery("#icon").attr("class") == "fa fa-angle-double-down"){
        jQuery("#allDevice").slideDown();
        jQuery("#icon").attr("class","fa  fa-angle-double-up");
        
    }else{
        jQuery("#allDevice").slideUp();
        jQuery("#icon").attr("class","fa fa-angle-double-down");
    }
   
}
    $scope.packSearchMenu = function(){
        jQuery("#menu").css("display","block");
        $scope.dModelNum = objects.length;
    }
//动态显示导航栏
    $scope.packSearchMenu = function(){
            jQuery(".active").css("display","block");
            jQuery("#arrow").animate({width:"180px"},200);
            jQuery("#iconSpan").css("display","none");
            jQuery("#searchDeviceDiv").css({'display':'none',"opacity":"0"});
            jQuery("#searchBanner").animate({width:"10px"},500);
            jQuery('#allDevice').css({'display':'none'});
            jQuery("#icon").attr("class","fa fa-angle-double-down");
    }
    $scope.shows = function(){
        jQuery("#arrow").animate({width:"0px"},200);
        jQuery(".active").css("display","none");
    }
    $scope.searchShows = function(){
        jQuery("#arrow").animate({width:"0px"},200);
        jQuery(".active").css("display","none");
        jQuery("#iconSpan").css("display","block");
        jQuery("#searchDeviceDiv").css({'display':'block',"opacity":"0.2"});
        jQuery("#searchBanner").animate({width:"470px"},500);
    }
    $scope.showList = function(){
        jQuery("#arrow").animate({width:"0px"},200);
        jQuery(".active").css("display","none");
        jQuery("#iconSpan").css("display","block");
        jQuery("#searchDeviceDiv").css({'display':'block',"opacity":"0.2"});
        jQuery("#searchBanner").animate({width:"470px"},500);
        jQuery("#icon").attr("class","fa fa-angle-double-up");
        jQuery("#allDevice").slideDown();

    }
    /*
$scope.packSearchMenu = function(){
    if(jQuery("#packUp").attr("class") == "fa fa-angle-double-left"){
        jQuery("#iconSpan").css("display","none");
        jQuery("#searchDeviceDiv").css("opacity","0");
        jQuery("#searchBanner").animate({width:"0px"},500);
        jQuery("#packUp").attr("class","fa fa-angle-double-right");
        jQuery("#allDevice").slideUp();
        jQuery("#icon").attr("class","fa fa-angle-double-down");


    }else{
        jQuery("#iconSpan").css("display","block");
        jQuery("#searchDeviceDiv").css("opacity","0.2");
        jQuery("#searchBanner").animate({width:"470px"},500);
        jQuery("#packUp").attr("class","fa fa-angle-double-left");
    }
}*/
    // $scope.changeIcon = function(){
    //     if(jQuery("#icon").attr("class") == "fa fa-angle-double-down"){
    //         jQuery("#icon").attr("class","fa  fa-angle-double-up");
    //     }else{
    //         jQuery("#icon").attr("class","fa fa-angle-double-down");
    //     }

    // }


    var idOffset;//用于查找下一页
    var textOffset;//用于查找下一页
    var hasNext;//判断是否存在下一页
    var preDeviceId = [];//用于查找上一页
    var preDeviceName = [];//用于查找上一页
    var pageNum = 1;//记录当前页面


    //当前场景下的id：/api/3d815/siteDevicePaging/2/133?limit=6&idOffset=&textOffset=
//默认设备列表/api/3d815/paging/2?limit=6&idOffset=&textOffset=
    jQuery.ajax({
        url:"/api/3d815/siteDevicePaging/"+tenantId+"/"+siteId+"?limit=6&idOffset=&textOffset=",
        contentType: "application/json; charset=utf-8",
        async: false,
        type:"GET",
        success:function(msg) {
            //console.log(msg);
            if(msg.data.length != 0){
                $scope.deviceList = msg.data;
                //console.log($scope.deviceList);
                //console.log($scope.deviceList.length);
                if($scope.deviceList.length>=6){
                    idOffset = msg.nextPageLink.idOffset;//用于查找下一页
                    textOffset = msg.nextPageLink.textOffset;//用于查找下一页
                    hasNext = msg.hasNext;//判断是否存在下一页

                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
            }
        }
    });


// 下一页
    $scope.nextPage = function(){
        console.log(hasNext);
        if(hasNext){
            jQuery.ajax({
                url:"/api/3d815/siteDevicePaging/"+tenantId+"/"+siteId+"?limit=6&idOffset="+idOffset+"&textOffset="+textOffset,
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(msg) {
                    console.log("/api/3d815/siteDevicePaging/"+tenantId+"/"+siteId+"?limit=6&idOffset="+idOffset+"&textOffset="+textOffset);
                    jQuery("#showDevice tr").remove();
                    pageNum++;
                    $scope.deviceList = msg.data;
                    if( msg.hasNext == true){
                        idOffset = msg.nextPageLink.idOffset;
                        textOffset = msg.nextPageLink.textOffset;
                        hasNext = msg.hasNext;
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);
                        // console.log($scope.deviceList);
                    }else{
                        hasNext = msg.hasNext;
                    }
                },
                error:function(err){
                    toastr.warning("当前已是最后一页！");
                }
            });
        }else{
            toastr.warning("当前已是最后一页！");
        }
    }

//上一页
    $scope.prePage = function(){
        if(pageNum == 1){
            toastr.warning("当前已是第一页！");
        }
        else if(pageNum == 2){
            jQuery.ajax({
                url:"/api/3d815/siteDevicePaging/"+tenantId+"/"+siteId+"?limit=6&idOffset=&textOffset=",
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(msg) {
                    pageNum--;
                    if(msg.data.length != 0){
                        jQuery("#showDevice tr").remove();
                        $scope.deviceList = msg.data;
                        console.log($scope.deviceList);
                        idOffset = msg.nextPageLink.idOffset;
                        textOffset = msg.nextPageLink.textOffset;
                        hasNext = msg.hasNext;
                        console.log(idOffset);
                        console.log(textOffset);
                        console.log(hasNext);
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);
                    }
                }
            });
        }else{
            jQuery.ajax({
                url:"/api/3d815/siteDevicePaging/"+tenantId+"/"+siteId+"?limit=6&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(msg) {
                    pageNum--;
                    jQuery("#showDevice tr").remove();
                    $scope.deviceList = msg.data;
                    console.log($scope.deviceList);
                    idOffset = msg.nextPageLink.idOffset;
                    textOffset = msg.nextPageLink.textOffset;
                    hasNext = msg.hasNext;
                    console.log(idOffset);
                    console.log(textOffset);
                    console.log(hasNext);
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);

                }
            });
        }
    }

/*搜索
$scope.searchDeviceInfo = function(){
    var temp= window.location.search;
    var tenantId = temp.split("=");
    console.log(tenantId[1]);
    tenantId[1] = 2;//用于测试
    var textSearch = jQuery("#searchDevice").val();
    if(jQuery("#allDevice").css("display") == "none"){
        jQuery("#allDevice").slideDown();
        jQuery("#icon").attr("class","fa  fa-angle-double-up");
    }
    if(textSearch === ""){
        //显示下方所有设备列表，从第一页开始
        // $scope.reShowList = function(){
        pageNum = 1;
        jQuery.ajax({
            url:"/api/3d815/paging/2?limit=6&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                if(msg.data.length != 0){
                    $scope.deviceList = msg.data;
                    // console.log($scope.deviceList);
                    idOffset = msg.nextPageLink.idOffset;
                    textOffset = msg.nextPageLink.textOffset;
                    hasNext = msg.hasNext;
                    // console.log(idOffset);
                    // console.log(textOffset);
                    // console.log(hasNext);
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
            }
        });
    }

    }*/

/*搜索*/
    $scope.searchDeviceInfo = function(){
        jQuery('#backList').css({'display':''});
        
        var textSearch = jQuery("#searchDevice").val();
        if(jQuery("#allDevice").css("display") == "none"){
            jQuery("#allDevice").slideDown();
            jQuery("#icon").attr("class","fa  fa-angle-double-up");
        }
        if(textSearch == ""){
            jQuery.ajax({
                url:"/api/3d815/siteDevicePaging/"+tenantId+"/"+siteId+"?limit=6&idOffset=&textOffset=",
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(msg) {
                    if(msg.data.length != 0){
                        $scope.deviceList = msg.data;
                        // console.log($scope.deviceList);
                        idOffset = msg.nextPageLink.idOffset;
                        textOffset = msg.nextPageLink.textOffset;
                        hasNext = msg.hasNext;
                        // console.log(idOffset);
                        // console.log(textOffset);
                        // console.log(hasNext);
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);
                    }
                }
            });
        }else{
            jQuery.ajax({
                url:"/api/3d815/search/"+tenantId+"?limit=6&textSearch="+textSearch,
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(msg) {
                    jQuery("#showDevice tr").remove();
                    console.log(msg.res.data);
                    $scope.deviceList = msg.res.data;
                    if($scope.deviceList.length<7){
                        hasNext=false;
                        pageNum == 1;
                    }
                }
            });
        }

    }


//点击x按钮消失
    $scope.closeDeviceList = function(){
        jQuery('#allDevice').css({'display':'none'});
        jQuery('#showDeviceInfo').css({'display':'none'});
    }

    $scope.closeDeviceInfo = function(){
        jQuery('#showDeviceInfo').css({'display':'none'});
        jQuery('#addModel').css({'display':'none'});
    }

    $scope.closeAddModel = function(){
        jQuery('#addModel').css({'display':'none'});
    }


    $scope.closeUpdate = function(){
        jQuery('#updatePosition').css({'display':'none'});
    }
    $scope.left = function(){
        jQuery('#showDeviceInfo').css({'display':''});
    }


//选中设备信息展示
    $scope.show = function(data){
        $scope.deviceInfo = data;
        //console.log($scope.deviceInfo);
        $scope.id = data.id;
        $scope.name = data.name;
        $scope.manufacture = data.manufacture;
        $scope.parentDeviceId = data.parentDeviceId;
        $scope.status = data.status;
        $scope.location = data.location;
        $scope.deviceType = data.deviceType;
        $scope.model = data.model;
        jQuery('#showDeviceInfo').css({'display':''});
    }

//移动鼠标点击tip显示右侧设备详情
    $scope.moveShowDetail = function(){
        var deviceAttrInfo = undefined;
        var deviceId = intersected.deviceId;
        $.ajax({
            url:'/api/3d815/getDeviceInfo/'+deviceId,
            type:'GET',
            async:false,
            success: function(res){
                deviceAttrInfo = res;
            },
            error: function(e){
                console.log(e.message);
            }
        });
        $scope.deviceInfo = deviceAttrInfo;
        $scope.id = deviceAttrInfo.id;
        $scope.name = deviceAttrInfo.name;
        $scope.manufacture = deviceAttrInfo.manufacture;
        $scope.parentDeviceId = deviceAttrInfo.parentDeviceId;
        $scope.status = deviceAttrInfo.status;
        $scope.location = deviceAttrInfo.location;
        $scope.deviceType = deviceAttrInfo.deviceType;
        $scope.model = deviceAttrInfo.model;

        $('#tip').css({'display':'none'});
        $('#showDeviceInfo').css({'display':''});
    }

//点击添加模型显示框
    $scope.addModel = function(){
        jQuery('#addModel').css({'display':''});
        jQuery('#updatePosition').css({'display':'none'});
    }

    //更新位置
    $scope.update = function(){
        jQuery('#addModel').css({'display':'none'});
        jQuery('#updatePosition').css({'display':''});
    }

    var flag = 0;
    $scope.lookAt = function(id) {
        
        var dModel = [];
        $.ajax({
            url:'/api/dModel/getSitedModelByDid/'+id,
            type:'GET',
            async:false,
            success: function(res){
                dModel = res.dModels;
            },
            error: function(e){
                alert("获取该设备模型失败"+e.message);
            }
        });
        var position = JSON.parse(dModel[0].location).position;
        switch (flag)
        {
            case 0:
                camera.position.set(position.x+6.0,position.y,position.z);
                camera.lookAt(position.x,position.y,position.z);
                
                flag+=1;
                break;
            case 1:
                camera.position.set(position.x,position.y,position.z-6.0);
                camera.lookAt(position.x,position.y,position.z);
                
                flag+=1;
                break;
            case 2:
                camera.position.set(position.x-6.0,position.y,position.z);
                camera.lookAt(position.x,position.y,position.z);
                
                flag+=1;
                break;
            case 3:
                camera.position.set(position.x,position.y,position.z+6.0);
                camera.lookAt(position.x,position.y,position.z);
                
                flag=0;
                break;
            default:
                flag = 0;
        }
        
        
    }




    //返回设备列表首页
    $scope.backList = function () {
        jQuery.ajax({
            url:"/api/3d815/siteDevicePaging/"+tenantId+"/"+siteId+"?limit=6&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                if(msg.data.length != 0){
                    $scope.deviceList = msg.data;
                    if($scope.deviceList.length>=6){
                        idOffset = msg.nextPageLink.idOffset;//用于查找下一页
                        textOffset = msg.nextPageLink.textOffset;//用于查找下一页
                        hasNext = msg.hasNext;//判断是否存在下一页
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);

                    }
                }
            }
        });
        jQuery('#backList').css({'display':'none'});
    }

    /*给当前租户，当前设备场景创建默认模型*/
    $scope.submitModel = function(){
        //console.log($scope.deviceInfo.id);
        //console.log($scope.deviceInfo.name);//均能正常获得；
        //var x = Number(jQuery("#xValue").val());
        //var y = Number(jQuery("#yValue").val());
        //var z = Number(jQuery("#zValue").val());
        //console.log(x);
        var JSONBody = {
            position:{
                x:Number(jQuery("#xValue").val()),
                y:Number(jQuery("#yValue").val()),
                z:Number(jQuery("#zValue").val())
            },
            scale:{
                x:Number(jQuery("#xScaleValue").val()),
                y:Number(jQuery("#yScaleValue").val()),
                z:Number(jQuery("#zScaleValue").val())
            },
            rotation:{
                x:Math.PI/2,
                y:Math.PI/2,
                z:Number(jQuery("#zRotationValue").val())
            }
        }
        console.log(JSONBody);

        jQuery.ajax({
            url: '/api/dModel/createModel/'+tenantId+'/'+siteId,
            dataType: 'json',
            method: 'POST',
            data: {
                "deviceId": $scope.deviceInfo.id,
                "location": JSON.stringify(JSONBody),
                "name": $scope.deviceInfo.name,
                "dModelUrl": "public/upload/devices/default/sensor_center.stl"
            },
            success:function(res){
                $("#addModel").modal("hide");
                location.reload();
                //console.log(res);
            },
            error:function(){
                alert("创建失败！");
            }
        });

    }

    $scope._updatePosition = function() {
        var target_p = new THREE.Vector3();
        downIntersected.getWorldPosition(target_p);
        var target_s = new THREE.Vector3();
        downIntersected.getWorldScale(target_s);
        var target_r = new THREE.Quaternion();
        downIntersected.getWorldQuaternion(target_r);
        var eu = new THREE.Euler().setFromQuaternion(target_r);
        var newLocation = {
            position:{
                x:Number(target_p.x.toFixed(9)),
                y:Number(target_p.y.toFixed(9)),
                z:Number(target_p.z.toFixed(9)),
            },
            scale:{
                x:Number(target_s.x.toFixed(6)),
                y:Number(target_s.y.toFixed(6)),
                z:Number(target_s.z.toFixed(6)),
            },
            rotation:{
                x:Number(eu.x.toFixed(9)),
                y:Number(eu.y.toFixed(9)),
                z:Number(eu.z.toFixed(9)),
            }
        };
        $.ajax({
            url:'/api/dModel/dModelLocation/'+ $scope.id,
            type:'PUT',
            data:{
                "location":JSON.stringify(newLocation)
            },
            async:false,
            success: function(res){
                if(res.res[0] === 1){
                    alert("更新位置成功！");
                } else{
                    alert("更新位置失败！请重试");
                }
            },
            error: function(e){
                alert("更新位置失败！可能是数据库问题~"+e.message);
            }
        });
    }

/*重置参数*/
    $scope.reSet = function(){
        jQuery('#xValue').val("");
        jQuery('#yValue').val("");
        jQuery('#zValue').val("");
        //jQuery('#xScaleValue').val("");
        //jQuery('#yScaleValue').val("");
        //jQuery('#zScaleValue').val("");
        //jQuery('#xRotationValue').val("");
        //jQuery('#yRotationValue').val("");
        //jQuery('#zRotationValue').val("");
    }
    $scope.uploadReSet = function(){
        jQuery('#xValue-s').val("");
        jQuery('#yValue-s').val("");
        jQuery('#zValue-s').val("");
    }
    /*删除模型*/
    $scope.delModel = function(){
        console.log($scope.deviceInfo);
        var deviceId = $scope.deviceInfo.id;
        console.log(deviceId);
        jQuery.ajax({
            url: '/api/dModel/dModelDelete/'+deviceId,
            dataType: 'json',
            method: 'DELETE',
            success:function(res){
                console.log(res);
                //alert("ssss");
                $("#deleteModel").modal("hide");
                location.reload();
            },
            error:function(){
                alert("已无模型！");
            }
        });
    }

/*更新设备模型*/
$scope.updateDeviceModel = function(){
    //console.log($scope.deviceInfo.id);
    var JSONBody = {
        position:{
            x:Number(jQuery("#xUpdate").val()),
            y:Number(jQuery("#yUpdate").val()),
            z:Number(jQuery("#zUpdate").val())
        },
        scale:{
            x:Number(jQuery("#xBili").val()),
            y:Number(jQuery("#yBili").val()),
            z:Number(jQuery("#zBili").val())
        },
        rotation:{
            x:Math.PI/2,
            y:Math.PI/2,
            z:Number(jQuery("#zXuan").val())
        }
    }
    //console.log(JSONBody);
    console.log(JSON.stringify(JSONBody));
    jQuery.ajax({
        url: '/api/dModel/dModelLocation/'+$scope.deviceInfo.id,
        dataType: 'json',
        method: 'PUT',
        data: {
            "deviceId": $scope.deviceInfo.id,
            "location": JSON.stringify(JSONBody),
            "name": $scope.deviceInfo.name,
            "dModelUrl": "public/upload/devices/default/sensor_center.stl"
        },
        success:function(res){
            //$("#addModel").modal("hide");
            location.reload();
            //alert("sss");
            console.log(res);
        },
        error:function(){
            alert("更新失败！");
        }
    });
}

/*上传模型*/
var parameter;
var file
$scope.fileSelected =function () {  
 file= document.getElementById("fileToUpload").files[0];
 $("#file1").val(file.name) ; 
}

$scope.updateFile = function(){
    function uploadProgress(evt) {  
            if (evt.lengthComputable) {  
              var percentComplete = Math.round(evt.loaded * 100 / evt.total);
              var pg=document.getElementById('progressNumber');  
              //console.log(percentComplete);
              //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%'; 
                  if(pg.value!=100) pg.value=percentComplete.toString();//进度条
                  else pg.value=0; 
            }  
            else {  
                alert('无法上传');
            }  
    }
    
      var index = file.name.lastIndexOf(".");
      var fileType = file.name.substring(index + 1, file.name.length);
      console.log("文件类型："+fileType);
      if(file.name.indexOf("%") != -1)
      {
        alert('文件名中不得包含%')
      }
      else if(file.size>1024*1024*100)
      {
           alert('请上传小于100M文件')
      }
      else if(fileType != "drc"&&fileType !="obj"&&fileType !="max"&&fileType !="glft" ) 
      {
           alert("请上传正确格式文件")
      }
      else
      {
           // var $input = $('#upFile');
            // var files = $input.prop('files');
            // console.log(files);
            var data = new FormData();
            data.append('fileToUpload', document.getElementById('fileToUpload').files[0]);
            console.log(data);
            $.ajax({
                url: "/api/uploadDevice"+"?tenantId="+tenantId+"&siteId="+siteId,
                type: 'POST',
                data: data,
                cache: false,
                processData: false,
                contentType: false,
                xhr: function(){ //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数    
                            myXhr = $.ajaxSettings.xhr();    
                        if(myXhr.upload){ //检查upload属性是否存在    
                            //绑定progress事件的回调函数    
                            myXhr.upload.addEventListener('progress',uploadProgress, false);     
                        }    
                        return myXhr; //xhr对象返回给jQuery使用    
                        },
                success:function(res){
                    parameter = res;
                    console.log(parameter);
                    alert('上传成功')
                },
                error:function(res)
                {
                    console.log(res)
                    alert('上传失败')
                }
            });
      }
}
$scope.uploadModel = function(){
    console.log(parameter);
    console.log(parameter.url);
    console.log($scope.deviceInfo.id);
    console.log("ssss");
    var JSONBody = {
        position:{
            x:Number(jQuery("#xValue-s").val()),
            y:Number(jQuery("#yValue-s").val()),
            z:Number(jQuery("#zValue-s").val())
        },
        scale:{
            x:Number(jQuery("#xScaleValue-s").val()),
            y:Number(jQuery("#yScaleValue-s").val()),
            z:Number(jQuery("#zScaleValue-s").val())
        },
        rotation:{
            x:Math.PI/2,
            y:Math.PI/2,
            z:Number(jQuery("#zRotationValue-s").val())
        }
    }
    console.log(JSONBody);
    jQuery.ajax({
        url: '/api/dModel/createModel/'+tenantId+'/'+siteId,
        dataType: 'json',
        method: 'POST',
        data: {
            "deviceId": $scope.deviceInfo.id,
            "location": JSON.stringify(JSONBody),
            "name": $scope.deviceInfo.name,
            "dModelUrl": parameter.url
        },
        success:function(res){
            //$("#addModel").modal("hide");
            location.reload();
            console.log(res);
            //alert("sucess1");
        },
        error:function(){
            alert("创建失败！");
        }
    });

}

/*双击将左边展示在文本框*/

//=======================加载本地模型=======
$scope.loadLocalModel = function(){
    alert("n");
}

//=============deviceDetail=============
$scope.closeDetail = function(){
    alert('e');
    $("#deviceDetail").css({'display':'none'});
    
}




//初始化显示默认模型jQuery-ui
    jQuery("#tabs").tabs();
    //拖动框
    jQuery("#addModel").draggable();
    jQuery("#updatePosition").draggable();
    jQuery("#showDeviceInfo").draggable();

}]);


