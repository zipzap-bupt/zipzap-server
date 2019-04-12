var loc = location.href;
var tenantId
if(loc.indexOf("?id=")!=-1)
            {
              var id = loc.substr(loc.indexOf("=")+1)//从=号后面的内容
              tenantId=id
            }
console.log(tenantId)
var siteId1
var siteId2
var idArray=[];
var nameArray=[];
var deviceID;
var siteID;
var str
var rowIdx
var idOffset;//用于查找下一页
var textOffset;//用于查找下一页
var hasNext;//判断是否存在下一页
var preDeviceId = [];//用于查找上一页
var preDeviceName = [];//用于查找上一页
var pageNum = 1;//记录当前页面
    $.ajax({
        url: '/api/tenantsites/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',

        error:function(){
            toastr.error('失败');
        },
        success: function(req) {
            //请求成功时处理
            idArray=[];
            nameArray=[];
            reqArray=req.data;
            for (var i = 0; i < req.sites.length; i++) {
                idArray.push(req.sites[i].id);
                nameArray.push(req.sites[i].name);
               }
           }

       });

function showTable(req)
{
    $("#myTable1  tr:not(:first)").empty(""); 
    for (var i = 0; i < req.data.length; i++) {
    var table = document.getElementById("myTable1");
    var row = table.insertRow(i+1);
    row.id = (i + 1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);

    cell0.innerHTML = '<td >'+req.data[i].id+'</td>' ;
    cell1.innerHTML = req.data[i].tenantId;
    if(req.data[i].customerId==1)
    {
        cell2.innerHTML = "未分配客户"
    }
    else
    {
        cell2.innerHTML = req.data[i].customerId;
    }
    cell3.innerHTML = req.data[i].name;
    cell4.innerHTML = req.data[i].parentDeviceId;
    if(req.data[i].siteId==-1||req.data[i].siteId==null)
    {
        cell5.innerHTML ="未分配";
    }
    else
    {
        cell5.innerHTML = nameArray[idArray.indexOf(req.data[i].siteId)]
    }
    cell6.innerHTML =  
        '<a onclick=look();><img style="width:30px;" src="../static/baidu/img/read.png" alt="查看" title="查看"/></a>'+'&nbsp;&nbsp;&nbsp;&nbsp;'+
        '<a onclick=distributeSite();><img style="width:30px;" src="../static/baidu/img/xiugai.png" alt="分配站点" title="分配站点"/></a>'+'&nbsp;&nbsp;&nbsp;&nbsp;'+
        '<a onclick=delectSite();><img style="width:30px;" src="../static/baidu/img/schu.png" alt="取消站点" title="取消站点"/></a>'
   }
}

init();
function init()
{
    //默认设备列表
jQuery.ajax({
    url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset=&textOffset=",
    contentType: "application/json; charset=utf-8",
    async: false,
    type:"GET",
    success:function(req) {
        if(req.data.length != 0){
           showTable(req)
             console.log(req);
             if(req.nextPageLink!=null)
             {
                idOffset = req.nextPageLink.idOffset;
                textOffset = req.nextPageLink.textOffset;
                hasNext = req.hasNext;
                // console.log(idOffset);
                // console.log(textOffset);
                // console.log(hasNext);
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
             }   
        }
    },
    error:function(error)
    {
        console.log(error)
    }
});
}

// 下一页
function nextPage(){
    console.log(hasNext);
    if(hasNext){
        jQuery.ajax({
            url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset="+idOffset+"&textOffset="+textOffset,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) { 
                console.log("/api/3d815/paging/"+tenantId+"?limit=9&idOffset="+idOffset+"&textOffset="+textOffset);
                pageNum++;  
                showTable(req)
                if( req.hasNext == true){
                    idOffset = req.nextPageLink.idOffset;
                    textOffset = req.nextPageLink.textOffset;
                    hasNext = req.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                    //console.log($scope.deviceList);
                }else{
                    hasNext = req.hasNext;
                    
                }
            },
            error:function(err){
                toastr.error("当前已是最后一页！");
            }
        });
    }else{
        toastr.warning("当前已是最后一页！");
    }
    
   
}

//上一页
function prePage(){
    if(pageNum == 1){
        toastr.warning("当前已是第一页！");
    }
    else if(pageNum == 2){
        jQuery.ajax({
            url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) {
                pageNum--;
                if(req.data.length != 0){
                    showTable(req)
                    idOffset = req.nextPageLink.idOffset;
                    textOffset = req.nextPageLink.textOffset;
                    hasNext = req.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
            }
        }); 
    }else{
        jQuery.ajax({
            url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) { 
                pageNum--;
                showTable(req);
                idOffset = req.nextPageLink.idOffset;
                textOffset = req.nextPageLink.textOffset;
                hasNext = req.hasNext;
                //console.log(idOffset);
                //console.log(textOffset);
                //console.log(hasNext);
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
                
            }
        });
    }
}

///////////////分配站点///////////
function distributeSite()
{
   $('#addSites').modal('show');
    var tableObj = document.getElementById("myTable1");
    //获取表格中的所有行      
    var rows = tableObj.getElementsByTagName("tr");
    //给tr绑定click事件
    for( i in rows)
    {
      rows[i].onclick = rowClick;
    }
  
  function rowClick(e)
  {
    var td = this.getElementsByTagName("td");
    rowIdx = $(td).parent()[0].rowIndex ;
    //alert("第 " + rowIdx + " 行");
    //console.log(rowIdx)
    deviceID=td[0].innerText;
    deviceName=td[3].innerText;
    $('#deviceName').val(td[3].innerText);
    $('#tenantId1').val(tenantId);
    for (i=0;i < idArray.length; i++) {
        document.getElementById("siteId2").options[i] = new Option(nameArray[i],i);
    }
  }
}

function siteDistribute()
{
  $.ajax({
        url: '/api/assignDevice/site',
        type: 'PUT',
        // async : false,
        data:
                {"id":deviceID,"siteId":idArray[nameArray.indexOf($('#siteId2 option:selected') .text())]},
        dataType: 'json',
        // contentType: 'application/json;charset=UTF-8',
        error:function(error){
            console.log(error)
            toastr.error('失败');
        },
        success: function(req) {
            $.ajax({
                url:'/api/dModel/getSitedModelByDid/'+deviceID,
                type:'GET',
                dataType:'json',
                error:function(error)
                {
                    console.log(error);
                },
                success:function(req)
                {
                    console.log(req);
                    if(req.dModels!="")
                    {
                        $.ajax({
                        url: '/api/dModel/dModelDelete/'+deviceID,
                        type: 'DELETE',
                        async : false,
                        dataType: 'json',
                        error:function(error){
                            toastr.error(error.responseJSON.message);
                            console.log(error)
                        },
                        success: function(req) {
                            console.log(req);
                            toastr.warning('删除原模型成功')
                         }  
                       });
                    }
                }
            });
            console.log(req);
            //请求成功时处理
            toastr.warning('分配成功')
            var tableObj = document.getElementById("myTable1");
            //获取表格中的所有行      
            var rows = tableObj.getElementsByTagName("tr");
            var td = rows[rowIdx].getElementsByTagName("td");
            td[5].innerHTML=nameArray[idArray.indexOf(parseInt(req.siteId))]
         }  
       });

}

/////////////取消站点分配//////////
function delectSite()
{
    var mymessage=confirm("确认取消站点分配？");
    if(mymessage==true)
    {

        var tableObj = document.getElementById("myTable1");
        //获取表格中的所有行      
        var rows = tableObj.getElementsByTagName("tr");
        //给tr绑定click事件
        for( i in rows)
        {
          rows[i].onclick = rowClick;
        }                      
       function rowClick(e)
       {
        var td = this.getElementsByTagName("td");
        rowIdx = $(td).parent()[0].rowIndex ;
        //console.log(rowIdx)
        $.ajax({
            url: '/api/assignDevice/site',
            type: 'PUT',
            // async : false,
            data:
                    {"id":td[0].innerText,"siteId":-1},
            dataType: 'json',
            // contentType: 'application/json;charset=UTF-8',
            error:function(error){
                toastr.error('取消失败');
            },
            success: function(req) {
                console.log(req);
                //请求成功时处理
                toastr.warning('取消成功')
                var tableObj = document.getElementById("myTable1");
                //获取表格中的所有行      
                var rows = tableObj.getElementsByTagName("tr");
                var td = rows[rowIdx].getElementsByTagName("td");
                td[5].innerHTML="未分配"
             }  
        });
        ////删除对应场景模型
        $.ajax({
            url:'/api/dModel/getSitedModelByDid/'+td[0].innerText,
            type:'GET',
            dataType:'json',
            error:function(error)
            {
                console.log(error);
            },
            success:function(req)
            {
                console.log(req);
                if(req.dModels!="")
                {
                    $.ajax({
                    url: '/api/dModel/dModelDelete/'+td[0].innerText,
                    type: 'DELETE',
                    async : false,
                    dataType: 'json',
                    error:function(error){
                        toastr.error(error.responseJSON.message);
                        console.log(error)
                    },
                    success: function(req) {
                        console.log(req);
                        toastr.warning('删除原模型成功')
                     }  
                   });
                }
            }
        });
    }
    }
    else if(mymessage==false)
    {
       
    }
    
}  

////////设备搜索////////
function deviceSearch() {
    if($("#searchValue").val()!='')
    {
        jQuery.ajax({
                url:"/api/3d815/search/"+tenantId+"?limit=1000&textSearch="+$("#searchValue").val(),
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(req) {
                    showTable(req.res)
                }
            });
    }
}

// ///////////////文本框-表格搜索/////////////
function deviceSearch1() 
{
  // var input = document.getElementById("searchValue");
  // var filter = input.value.toUpperCase();//转换为大写
  // var table = document.getElementById("myTable1");
  // var tr = table.getElementsByTagName("tr");

  // for (var i = 0; i < tr.length; i++) {
  //   //td = tr[i].getElementsByTagName("td")[0];
  //   if (filter=='') {
  //     //if (filter==parseInt(td.innerHTML.toUpperCase())) {
  //       tr[i].style.display = "";
  //     } 
  //   } 
  init();
}

////////////跳转///////
function look()
{
        var tableObj = document.getElementById("myTable1");
        //获取表格中的所有行      
        var rows = tableObj.getElementsByTagName("tr");
        //给tr绑定click事件
        for(var i in rows){
          rows[i].onclick = rowClick;
        }
      
      function rowClick(e){ 
        //alert(this.rowIndex); //显示所点击的行的索引
        //console.log(this );
        var td = this.getElementsByTagName("td");
        if(td[5].innerHTML=="未分配")
        {
            toastr.warning('该设备没有分配站点')
        }
         else
         {
            location.href="/baidu?id="+tenantId+"&listID="+idArray[nameArray.indexOf(td[5].innerHTML)]
         }
      }         
}

function lookMap()
{
    location.href="/baidu?id="+tenantId;
}

