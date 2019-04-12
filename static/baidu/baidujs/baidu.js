var loc = location.href;
var tenantId
if((loc.indexOf("?id=")!=-1)&&(loc.indexOf("&listID=")!=-1))
{
    tenantId=loc.substring(loc.indexOf('=')+1,loc.indexOf('&'));
}


else if(loc.indexOf("?id=")!=-1)
            {
              var id = loc.substr(loc.indexOf("=")+1)//从=号后面的内容
              tenantId=id
            }
console.log(tenantId)
document.write("<script language=javascript src='../static/baidu/baidujs/upLoadFile.js'><\/script>");
var index = 0;
var reqArray=[];
var idArray=[];
var logArray=[];
var lohArray=[];
var nameArray=[];
var adds=[];
var markers=[];
var overlays=[];
var label=[];
var a;
var openIfoID;
var content;
var siteID;
var date1 
var year
var month
var date
var marker
var drawingManager
var biaozhi;
var sign
// var idOffset;//用于查找下一页
// var textOffset;//用于查找下一页
// var hasNext;//判断是否存在下一页
// var preDeviceId = [];//用于查找上一页
// var preDeviceName = [];//用于查找上一页
// var pageNum = 1;//记录当前页面

var map = new BMap.Map("allmap");    // 创建Map实例
var markerClusterer 
var styleJson =[                     //个性化地图
          {
                    "featureType": "building",
                    "elementType": "geometry",
                    "stylers": {
                              "color": "#eeeeeeff"
                    }
          },
          {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                              "color": "#cfe2f3ff"
                    }
          },
          {
                    "featureType": "manmade",
                    "elementType": "all",
                    "stylers": {
                              "color": "#ccccccff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "all",
                    "stylers": {
                              "color": "#ffe599ff"
                    }
          }
]

map.setMapStyle({styleJson:styleJson});
map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);  // 初始化地图,设置中心点坐标和地图级别
//添加地图类型控件
map.addControl(new BMap.MapTypeControl({
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP,
        BMAP_SATELLITE_MAP,
    ]}));
var cityList = new BMapLib.CityList({
    container: 'container',
    map: map
});

//添加比例尺等控件
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
//var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
map.addControl(top_left_control);
map.addControl(top_left_navigation);
var myDis = new BMapLib.DistanceTool(map);
map.centerAndZoom("北京");         // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
var point=new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 12);

    //覆盖物
var overlaycomplete=function(e){
    overlays.push(e.overlay);
    label.push(e.label);
    //console.log(e);
};
var styleOptions = {
    strokeColor:"red",    //边线颜色。
    fillColor:"",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: false, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});
//测量事件监听
// map.addEventListener("load",function(){
//     myDis.open();  //开启鼠标测距
//     //myDis.close();  //关闭鼠标测距大
// });

/////////////地点搜索//////
function G(id) {
        return document.getElementById(id);
    }
    // 定义一个控件类,即function
    function ZoomControl() {
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        this.defaultOffset = new BMap.Size(10, 10);
    }
    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();
    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个p元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function(map){
      // 创建一个DOM元素
      var p = document.createElement("p");
      p.innerHTML = '<p id="r-result"><input type="text" id="suggestId" class="form-control" placeholder="请输入地点" size="20"  style="width:200px; font-size:15px;" /></p><p id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></p>';
      // 添加DOM元素到地图中
      map.getContainer().appendChild(p);
      // 将DOM元素返回
      return p;
    }
    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);
    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
        ,"location" : map
    });
    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
    var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
 
        setPlace();
    });
 
    function setPlace(){
        //map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            var placeLocal = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(placeLocal, 22);
            //map.addOverlay(new BMap.Marker(placeLocal));    //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
    }

//百度地图API功能
function addClickHandler(content,marker){

    marker.addEventListener("click",function(e){
        openInfo(content,e)
        openIfoID=marker;
        //console.log(openIfoID);
        //console.log(content);
        }
    );
    var markerMenu=new BMap.ContextMenu();
    markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
    marker.addContextMenu(markerMenu);
}

function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}

//////////////////////////////删除站点//////////////////////////////
function removeMarker(e,ee,marker){
    var mymessage=confirm("确认删除站点？");
    if(mymessage==true)
    {
        console.log(marker.point);
        for(var i=0;i<reqArray.length;i++)
        {
            if((marker.point.lat==reqArray[i].latitude)&& (marker.point.lng==reqArray[i].longtitude))
            {
                map.removeOverlay(marker);
                markerClusterer.removeMarker(marker); //删除标记从聚合点中删除
                //toastr.warning(reqArray[i].id);
                $.ajax({
                    url:'/api/sites/'+reqArray[i].id,
                    type:'DELETE',//提交方式
                    dataType:'JSON',//返回字符串，T大写
                    success: function(req)
                    {
                        if(req!='')
                        {
                            toastr.warning('删除成功');
                        }
                        else
                        {
                            toastr.warning('删除失败');
                        }
                    },
                    error:function(error)
                    {
                        toastr.warning(error.message);
                    },
                    complete:function()
                    {
                        getSites();
                    }
                });
            }
        }

    }
    else if(mymessage==false)
    {
       
    }
}
var opts = {
    width : 300,     // 信息窗口宽度
    height: 150,     // 信息窗口高度
    enableAutoPan:true,
    enableMessage:true//设置允许信息窗发送短息

};

function addContent(tenantId,id,name,longtitude,latitude,year,month,date)
{
        var content =
                    '<div >'+
                    ' <table>'+
                    ' <tr>'+
                    ' <td>'+'用户id:'+'</td>'+
                    '<td>'+tenantId+
                    '</td>'+
                    '</tr>'+
                    ' <tr>'+
                    ' <td>'+'站点id:'+'</td>'+
                    '<td>'+id+
                    '</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'名称:'+'</td>'+
                    '<td>'+name+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'经度:'+'</td>'+
                    '<td>'+longtitude+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'纬度:'+'</td>'+
                    '<td>'+latitude+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'创建时间:'+'</td>'+
                    '<td>'+year+'-'+month+'-'+date+'</td>'+
                    '</tr>'+
                    '</table> '+'<input type="button" id="addModel" value="上传场景" onclick="addModel()" />'+'&nbsp;&nbsp;&nbsp;&nbsp;'
                    +'<input type="button" id="alterSite" value="修改站点" onclick="alterSite()"/>'+'&nbsp;&nbsp;&nbsp;&nbsp;'
                    +'<input type="button" value="逆解析" onclick="bdGEO()">'+'&nbsp;&nbsp;&nbsp;&nbsp;'
                    +'<input type="button" value="进入场景" onclick="intoScence()">'
                    +'</div>'

                    return content;
}
function addMarkers(id,longtitude,latitude,sign)
{
                var point=new BMap.Point(longtitude,latitude);
                adds.push(point);
                var marker = new BMap.Marker(point);// 创建标注
                markers.push(marker);
                if(sign)
                {
                    map.addOverlay(marker);
                    markerClusterer.addMarker(marker); //新建标记放入聚合点
                }                
                marker.disableDragging();           // 不可拖拽
                var label = new BMap.Label(id,{offset:new BMap.Size(20,-10)});
                marker.setLabel(label);
                return marker;
}

function getSites()
{
    $.ajax({
        url: '/api/tenantsites/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        error:function(){
            toastr.warning('失败');
        },
        success: function(req) {
            //请求成功时处理
            idArray=[];
            logArray=[];
            lohArray=[];
            nameArray=[];
            reqArray=req.sites;
            for (var i = 0; i < req.sites.length; i++) {
                idArray.push(req.sites[i].id);
                logArray.push(req.sites[i].longtitude);
                lohArray.push(req.sites[i].latitude);
                nameArray.push(req.sites[i].name);
                date1=new Date(req.sites[i].createdAt);
                year=date1.getFullYear();
                month=date1.getMonth()+1;
                date=date1.getDate();
                //console.log(req.sites[i].id);
        }
        }
    });
}

/////////////////////////////初始化//////////////////
window.onload=
function (){
    //报警弹窗
    if(warningEvent(false)==false)
    {
        $('#warningList').modal('show');
    }
    $.ajax({
        url: '/api/tenantsites/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',

        error:function(){
            toastr.warning('失败');
        },
        success: function(req) {
            console.log(req.sites);
            //请求成功时处理
            reqArray=req.sites;
            idArray=[];
            logArray=[];
            lohArray=[];
            nameArray=[];
            for (var i = 0; i < req.sites.length; i++) {
                idArray.push(req.sites[i].id);
                logArray.push(req.sites[i].longtitude);
                lohArray.push(req.sites[i].latitude);
                nameArray.push(req.sites[i].name);
                 var date1=new Date(req.sites[i].createdAt);
                 var year=date1.getFullYear();
                 var month=date1.getMonth()+1;
                 var date=date1.getDate();
                 var content =addContent(tenantId,req.sites[i].id,req.sites[i].name,req.sites[i].longtitude,req.sites[i].latitude,year,month,date)
                 var marker =addMarkers(req.sites[i].id,req.sites[i].longtitude,req.sites[i].latitude)
                 //console.log(addContent())
                 addClickHandler(content,marker);

            }
        }, complete: function() {
            //请求完成的处理
            toastr.success('连接完成');
            ///////////////////////////列表跳转///////////////////////////////////////
            
            if(loc.indexOf("&listID=")!=-1)
            {
              var id = loc.substr(loc.indexOf("&")+8)//从=号后面的内容
              //toastr.warning(id);
               var a=idArray.indexOf(parseInt(id));
                if(a!=-1)
                {
                     point=new BMap.Point(logArray[a],lohArray[a]);
                     map.centerAndZoom(point, 22);
                }
                else
                {
                    toastr.warning('跳转失败');
                }
            }
        }
    });
    //聚合点
    markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
}

//////////////////////////添加站点///////////////////
function markfinish(){
        if($.inArray($('#name1').val(), nameArray)==-1)
        {
        if(name1.value!=""&&longitude.value!=""&&latitude.value!="")
        {
        map.removeEventListener("click");
        map.removeEventListener("click",getPoint);
        map.setDefaultCursor("url(http://api0.map.bdimg.com/images/openhand.cur) 8 8,default");
        //$('#addSites').modal('hide');
        $.ajax({
            url:'/api/sites',
            data:
                {name:$("#name1").val(),tenantId:tenantId,longtitude:$("#longitude").val(),latitude:$("#latitude").val()},
            type:'POST',//提交方式
            dataType: 'json',
            success: function(req){
                getSites();
                if(req!='')//data.trim 去空格,防止出错
                 { getSites();
                 var content =addContent(tenantId,req.id,req.name,req.longtitude,req.latitude,year,month,date)
                 var marker =addMarkers(req.id,req.longtitude,req.latitude,true)
                 map.centerAndZoom(new BMap.Point(req.longtitude, req.latitude), map.getZoom());
                 //addMarkers(req.id,req.longtitude,req.latitude)
                 addClickHandler(content,marker);
                 //addMarkers(tenantId,req.id,req.name,req.longtitude,req.latitude,year,month,date)        
                    toastr.warning ("添加成功 ");}
                else
                    {toastr.warning("添加失败");}
            },
			error:function(error)
			{
				toastr.error('错误');
			},
            complete:function()
            {
               getSites();
            }
        });
        }
        else
        {
            toastr.warning('输入不能为空！')
        }
    }
    else
    {
        toastr.warning('该站点名已存在')
    }
    $('#name1').val("");  
    $('#longitude').val("");  
    $('#latitude').val("");  
}

//标注
function mark1()
{
    if(myDis.open())
    {
    	myDis.close();  //关闭鼠标测距大
    }
    console.log(drawingManager._isOpen)
    if(drawingManager._isOpen)
    {
    	drawingManager.close();
    }
    $('#tenantId1').val(tenantId);
    //$('#addSites').modal('show');  
}

function getPoint(e)
{
   $('#tenantId1').val(tenantId);
   $('#longitude').val(e.point.lng);
   $('#latitude').val(e.point.lat);
   $('#addSites').modal('show');
}

function mark2()
{
    if(myDis.open())
    {
    	myDis.close();  //关闭鼠标测距大
    }
    if(drawingManager._isOpen)
    {
    	drawingManager.close();
    }
    map.setDefaultCursor("crosshair");
    map.addEventListener("click",getPoint);
    //toastr.warning(map.getDefaultCursor());
 }

///////////////////////修改站点//////////////////////////
function alterSite()
{
    //getSites();
    $('#renameSite').modal('show')
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {
            a=i;
            marker=openIfoID;
            siteId=reqArray[i].id;
            $('#siteOldID').val(reqArray[i].id);
            $('#siteOldName').val(reqArray[i].name);
            //siteOldID.value=reqArray[i].id;
            //siteOldName.value=reqArray[i].name;
            }
    }
}

function renameSite() {
    if($.inArray($('#siteNewName').val(), nameArray)==-1)
    {
       if($('#siteNewName').val()!="")
        {
        $.ajax({
            url: '/api/sitename/' + siteId,
            data:
                {name:$('#siteNewName').val()},
            type: 'put',//提交方式
            dataType: 'JSON',//返回字符串，T大写
            success: function (req) {
                //console.log(req)
                //$('#renameSite').modal('hide')
                if (req != '') {
                    toastr.warning('修改完成');
                    getSites();
                }
                else {
                    toastr.warning('修改失败');
                }
            },
            error: function (error) {
                toastr.error(error.message);
            },
            complete:function()
            {
                map.removeOverlay(marker);
                var content =addContent(tenantId,reqArray[a].id,reqArray[a].name,reqArray[a].longtitude,reqArray[a].latitude,year,month,date);
                map.addOverlay(marker);
                marker.disableDragging();           // 不可拖拽
                addClickHandler(content,marker);
                var label = new BMap.Label(siteId,{offset:new BMap.Size(20,-10)});
                marker.setLabel(label);
            }
        });
    }
        else
        {
            toastr.warning('输入不能为空！')
        } 
    }
        else
        {
            toastr.warning('该站点名已存在');
        }
    $('#siteNewName').val("");    
}

///////////////////////查找站点//////////////////
$(btn).click(function(){
    //console.log(nameArray)
    //console.log($.inArray(address.value, nameArray));
    // var a=nameArray.indexOf(address.value);
    // if(a!=-1)
    // {
    //      //logArray=req.sites[i].longtitude;
    //      //lohArray=req.sites[i].latitude;
    //      point=new BMap.Point(logArray[a],lohArray[a]);
    //      map.centerAndZoom(point, 22);
    // }
    // else
    // {
    //     toastr.warning('没有发现该站点')
    // }
    $.ajax({
        url:'/api/sites/'+$(address).val(),
        type:'get',//提交方式
        dataType:'JSON',//返回字符串，T大写
        success: function(req){
            console.log(req.sites)
            
            if(req.sites=='')
            {
                toastr.warning('该站点不存在');
            }
            else if(req.sites[0].tenantId==tenantId)
            {
                
                point=new BMap.Point(req.sites[0].longtitude,req.sites[0].latitude);
                map.centerAndZoom(point, 20);
                var allOverlay = map.getOverlays();
                console.log(allOverlay)
                console.log(req.sites[0].id)
                for (var i = 1; i < allOverlay.length ; i++){                   
                        console.log(allOverlay[i].toString())
                        if(allOverlay[i].toString()=="[object Marker]")
                        {
                            console.log(allOverlay[i])
                            console.log(allOverlay[i].getLabel())
                            if(allOverlay[i].getLabel()!=null)
                            {
                                //toastr.warning('跳动')
                                if(allOverlay[i].getLabel().content == req.sites[0].id)
                                {
                                    var myIcon = new BMap.Icon(src="../static/baidu/img/008h.gif", new BMap.Size(25, 40), {anchor: new BMap.Size(15, 25), imageOffset: new BMap.Size(0, 0),imageSize:new BMap.Size(30, 30)}); // 指定定位位置  });
                                    allOverlay[i].setIcon(myIcon);
                                    // setInterval(function()
                                    // { 
                                    //     //console.log(i)
                                    //     //console.log(allOverlay[1].getIcon())
                                    //     switch(allOverlay[i-1].getIcon().imageUrl)
                                    //     {
                                    //     case "http://api.map.baidu.com/library/MarkerTool/1.2/src/images/us_mk_icon.png":
                                    //       allOverlay[i-1].setIcon(myIcon1);
                                    //       break;
                                    //     case "http://api0.map.bdimg.com/images/marker_red_sprite.png":
                                    //       allOverlay[i-1].setIcon(myIcon);
                                    //       break;
                                    //     default:
                                          
                                    //     }                  
                                    // },500); //每隔500毫秒执行一次test()函数，执行无数次。
                                    // var myIcon = new BMap.Icon(src="../static/baidu/img/gif031.gif", new BMap.Size(25, 40), {anchor: new BMap.Size(15, 25), imageOffset: new BMap.Size(0, 0),imageSize:new BMap.Size(30, 30)}); // 指定定位位置  });
                                    // var myIcon1 = new BMap.Icon("http://api0.map.bdimg.com/images/marker_red_sprite.png", new BMap.Size(19,25),{anchor:new BMap.Size(10, 25)});
                                    
                                } 
                            }                            
                        }
                }
            }
            else
            {
                toastr.warning('没有发现该站点');
            }
            
        },
        error:function(error)
        {
            toastr.error(error.message);
        }
    });
});

//添加模型
function addModel()
{
    $('#addSences').modal('show');
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {        
            //siteId.value=reqArray[i].id;
            $('#siteId').val(reqArray[i].id);
            $('#siteName').val(reqArray[i].name);
            }
    }
}

/////进入场景/////
function intoScence()
{
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {        
             location.href="/demo?id="+tenantId+"&siteId="+reqArray[i].id;
            }
    }
}

//关闭窗口
function closeWin()
{
    $('#addSites').modal('hide');
    map.removeEventListener("click",getPoint);
    map.setDefaultCursor("url(http://api0.map.bdimg.com/images/openhand.cur) 8 8,default");
}

//////拉框//////
function draw() {
    if(myDis.open())
    {
        myDis.close();  //关闭鼠标测距大
    }
    if(biaozhi==1)
    {
        $("#myTable2  tr:not(:first)").empty("");
        biaozhi=0;
    }
    drawingManager.open()
    drawingManager.enableCalculate()
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE1);
}
function rectangleAreaMeasure()
{
    if(myDis.open())
    {
        myDis.close();  //关闭鼠标测距大
    }
    drawingManager.open()
    drawingManager.enableCalculate()
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
}

/////////面积测量////////
function areaMeasure()
{
    if(myDis.open())
    {
        myDis.close();  //关闭鼠标测距大
    }
    drawingManager.open()
    drawingManager.enableCalculate()
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
}

function circleAreaMeasure()
{
    if(myDis.open())
    {
        myDis.close();  //关闭鼠标测距大
    }
    drawingManager.open()
    drawingManager.enableCalculate()
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
}

//////清除覆盖物/////
function clearAll() {
    biaozhi=1;
    drawingManager.close();
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
        map.removeOverlay(label[i]);  
    }
    overlays.length = 0
    label.length=0;
}


////////设备搜索///////
function deviceSearchBox()
{
    //$("#myTable3  tr:not(:first)").empty(""); 
    //$('#deviceSearch').modal('show'); 
    document.getElementById( "deviceInfo1" ).style.display="none" ;
}

function showTable(req)
{               
                $("#myTable3  tr:not(:first)").empty(""); 
                for (var i = 0; i < req.data.length; i++) {
                var table = document.getElementById("myTable3");
                var row = table.insertRow(i+1);
                row.id = (i + 1);
                var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(1);
                var cell2 = row.insertCell(2);
                var cell3 = row.insertCell(3);
                var cell4 = row.insertCell(4);
                var cell5 = row.insertCell(5);
                cell0.innerHTML = '<td id=row.id>'+req.data[i].id+'</td>'
                cell1.innerHTML = req.data[i].tenantId;
                if(req.data[i].customerId==1)
                {
                    cell2.innerHTML ="未分配"
                }
                else
                {
                    cell2.innerHTML = req.data[i].customerId; 
                }
                cell3.innerHTML = req.data[i].name;
                cell4.innerHTML = nameArray[idArray.indexOf(req.data[i].siteId)] 
                cell5.innerHTML = '<input type="button" class="btn btn-primary" value="进入站点" onclick="lookDevice(1)"/>'
               }
               document.getElementById( "deviceInfo1" ).style.display="" ;
}

function deviceSearch() {
    if($("#searchDevice").val()!='')
    {
        $.ajax({
                url:"/api/3d815/search/"+tenantId+"?limit=2000&textSearch="+$("#searchDevice").val(),
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(req) {
                    console.log(req.res)
                    showTable(req.res)
                    if(req.res.nextPageLink!=null)
                     {
                        idOffset = req.res.nextPageLink.idOffset;
                        textOffset = req.res.nextPageLink.textOffset;
                        hasNext = req.res.hasNext;
                        console.log(idOffset);
                        console.log(textOffset);
                        console.log(hasNext);
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);
                     }
                }
            });
    }
}

// function nextPage(){
//     console.log(hasNext);
//     if(hasNext){
//         jQuery.ajax({
//             url:"/api/3d815/siteDevicePaging/"+tenantId+"?limit=2"+25+"&idOffset="+idOffset+"&textOffset="+textOffset,
//             contentType: "application/json; charset=utf-8",
//             async: false,
//             type:"GET",
//             success:function(req) { 
//                 console.log("/api/3d815/siteDevicePaging/"+tenantId+"?limit=2&idOffset="+idOffset+"&textOffset="+textOffset)
//                 console.log(req.res)
//                 pageNum++;  
//                 showTable(req.res)
//                 if( req.res.hasNext == true){
//                     idOffset = req.res.nextPageLink.idOffset;
//                     textOffset = req.res.nextPageLink.textOffset;
//                     hasNext = req.res.hasNext;
//                     preDeviceId.push(idOffset);
//                     preDeviceName.push(textOffset);
//                     //console.log($scope.deviceList);
//                 }else{
//                     hasNext = req.res.hasNext;
                    
//                 }
//             },
//             error:function(err){
//                  console.log("/api/3d815/siteDevicePaging/"+tenantId+"?limit=2&idOffset="+idOffset+"&textOffset="+textOffset)
//                 console.log(err)
//                 toastr.warning(err.message);
//             }
//         });
//     }else{
//         toastr.warning("当前已是最后一页！");
//     }
    
   
// }

// //上一页
// function prePage(){
//     if(pageNum == 1){
//         toastr.warning("当前已是第一页！");
//     }
//     else if(pageNum == 2){
//         jQuery.ajax({
//             url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset=&textOffset=",
//             contentType: "application/json; charset=utf-8",
//             async: false,
//             type:"GET",
//             success:function(req) {
//                 pageNum--;
//                 if(req.data.length != 0){

//                     showTable(req)
//                     idOffset = req.nextPageLink.idOffset;
//                     textOffset = req.nextPageLink.textOffset;
//                     hasNext = req.hasNext;
//                     preDeviceId.push(idOffset);
//                     preDeviceName.push(textOffset);
//                 }
//             }
//         }); 
//     }else{
//         jQuery.ajax({
//             url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
//             contentType: "application/json; charset=utf-8",
//             async: false,
//             type:"GET",
//             success:function(req) { 
//                 pageNum--;
//                 showTable(req);
//                 idOffset = req.nextPageLink.idOffset;
//                 textOffset = req.nextPageLink.textOffset;
//                 hasNext = req.hasNext;
//                 //console.log(idOffset);
//                 //console.log(textOffset);
//                 //console.log(hasNext);
//                 preDeviceId.push(idOffset);
//                 preDeviceName.push(textOffset);
                
//             }
//         });
//     }
// }

function lookSiteList()
{
    location.href="/sitesList?id="+tenantId;
}
function lookMap()
{
    location.href="/baidu?id="+tenantId;
}

function measure(){
	myDis.open();           
    if(drawingManager._isOpen)
    {
    	drawingManager.close();
    }
}

function lookDevice(e)
{       
    
    switch(e)
    {
    case 1:
      var tableObj = document.getElementById("myTable3");
      break;
    case 2:
      var tableObj = document.getElementById("myTable2");
      break;
    default:
    }
       //获取表格中的所有行      
        var rows = tableObj.getElementsByTagName("tr"); 
        //给tr绑定click事件
        for(var i in rows){
          rows[i].onclick = rowClick;
        }
      function rowClick(e){ 
        //toastr.warning(this.rowIndex); //显示所点击的行的索引
        //console.log(this );
        var td = this.getElementsByTagName("td");
        if(td[4].innerHTML=="undefined")
        {
            toastr.warning('该设备没有分配站点')
        }
        else
        {
            location.href="/demo?tenantId="+tenantId+"&siteId="+idArray[nameArray.indexOf(td[4].innerHTML)]+"&deviceId="+td[0].innerHTML;
        }
         
      }         
}

var app = angular.module("myApp1", []);
app.controller("myCtrl1", function($scope) {
    $scope.show = function () {
     $('#addressList').modal('show');
    };
    $scope.a1 = function ($index) {
        var ePoint=$("#myTable4").find("tr").eq($index+1).find("td").eq(0).prevObject[2].innerHTML;
        map.centerAndZoom(new BMap.Point(ePoint.substring(1, ePoint.indexOf(',')),ePoint.substring(ePoint.indexOf(',')+1, ePoint.length-1)), 22);
        $('#addressList').modal('hide');
    };
});

app.controller("myCtrl2", function($scope) {
    $scope.show = function () {
        $('#warningList').modal('show');
    };
    $scope.statusChange = function ($index) {
        $.ajax({
           url:'api/3d815/getDeviceInfo/'+$("#myTable5").find("tr").eq($index+1).find("td").eq(0).prevObject[1].innerHTML,
           type:'get',//提交方式
           dataType:'JSON',//返回字符串，T大写
           success: function(req){
            //console.log(req)
            if(req.siteId==-1)
            {
               toastr.warning('报警信息已查看。'+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'+'设备没有分配站点，请分配！');
               //alert('报警信息已查看'+'\r'+'设备没有分配站点，请分配！')
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

        $.ajax({
            url: 'api/warning/readWarning/'+$("#myTable5").find("tr").eq($index+1).find("td").eq(0).prevObject[0].innerHTML,
            type: 'get',
            async : false,
            dataType: 'json',
            error:function(){
                toastr.error('失败');
            },
            success: function(req) {
            }
       });
    };
});

/////////逆解析////
function bdGEO(){
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {        
            //siteId.value=reqArray[i].id;
            var pt = openIfoID.point;
            }
    }
    geocodeSearch(pt);  
}

function geocodeSearch(pt){
    var myGeo = new BMap.Geocoder();
    myGeo.getLocation(pt, function(rs){
        //console.log(rs)
        var addComp = rs.addressComponents;
        $("#address1").val(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber)
        var appElement = document.querySelector('[ng-controller=myCtrl1]');
        //获取$scope变量
        var $scope = angular.element(appElement).scope();
        //调用names变量，并改变names的值
        $scope.names= rs.surroundingPois
        //新建names，如果想同步到Angular控制器中，则需要调用$apply()方法即可
        $scope.$apply();
        //调用控制器中的show()方法
        $scope.show();     
    });
}

//////报警事件/////
var warning;
function warningEvent(sign){
    var appElement = document.querySelector('[ng-controller=myCtrl2]');
    var $scope = angular.element(appElement).scope();            
    $.ajax({
        url: 'api/warning/getTenantWarning/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;',

        error:function(){
            toastr.error('失败');
        },
        success: function(req) {
            if(req!='')
            {
                warning= false;
                $scope.req=req;
                $scope.$apply();
                $scope.show();                
            }
            else
            {
                if(sign==true)
                {
                   toastr.warning("无报警事件") 
                }
                warning= true;
            }            
           }
       });
    return warning
}