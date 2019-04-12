
mainApp.controller("deviceCtrPanel",["$scope","$resource",function($scope,$resource){
    /*--------显示遥测数据-------------*/
    /*时间格式化*/
    function formatDate(now) {
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();
        var second=now.getSeconds();
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    }

    /*  补零函数  */

    function PrefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
       }

    /*  UTC时间  */
    function getUTC(now) {
        var year=now.getFullYear();
        var month=PrefixInteger((now.getMonth()+1),2);
        var date=PrefixInteger(now.getDate(),2);
        var hour=PrefixInteger(now.getHours(),2);
        var minute=PrefixInteger(now.getMinutes(),2);
        return year+"-"+month+"-"+date+"T"+hour+":"+minute;
    }

    // 判断元素是否在数组中
    function inArray(value, array) {
        var i = array.length;
        while (i--) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }


    /*    webSocket start  */
    var ws;
    function realtimeDevice(deviceId) {
        //var url = 'ws://39.104.189.84:30080/api/v1/deviceaccess/websocket';
        var url = 'ws://139.159.242.107:30080/api/v1/deviceaccess/websocket';
        var keys = [];
        listenWs(url);


        function listenWs(url) {
            if(ws instanceof WebSocket){
                ws.close();
            }

            ws = new WebSocket(url);

            ws.onopen = function (e) {
                log("Connected");
                sendMessage('{"deviceId":"' + deviceId + '"}');
            };

            ws.onclose = function (e) {
                log("Disconnected: ");
            };
            // Listen for connection errors
            ws.onerror = function (e) {
                log("Error ");
            };
            // Listen for new messages arriving at the client
            //var time0 = formatDate(time);
            ws.onmessage = function (e) {
                //e是返回体
                log("Message received: " + e.data);
                var message = JSON.parse(e.data);

                for(var i in message.data) {
                    console.log(message.data[i].ts);
                    console.log(message.data[i].key);
                    console.log(message.data[i].value);
                    var telemetryDate = formatDate(new Date(message.data[i].ts));
                    var telemetryKey = message.data[i].key;
                    var telemetryValue = message.data[i].value;
                    var key = telemetryKey;
                    // 是之前出现过的key，则刷新原来的行
                    if (inArray(key, keys)) {
                        // 遍历table
                        $('#realtime_data_table tr').each(function(trindex) {
                            var tableKey = $(this).children('td').eq(1).text();
                                if (tableKey === key){
                                $(this).children('td').eq(0).text(telemetryDate);
                                $(this).children('td').eq(2).text(telemetryValue);
                            }
                        });
                    }
                    // 是之前未出现过的key，则新加一行显示
                    else {
                        // console.log(keys);
                        keys.push(key);
                        $('#realtime_data_table').append('<tr><td>' + telemetryDate + '</td><td>' + key + '</td><td>' + telemetryValue + '</td></tr>');
                    }
                }

            }
        }


        function log(s) {
            // Also log information on the javascript console
            console.log(s);
        }

        function sendMessage(msg) {
            ws.send(msg);
            log("Message sent");
        }
    }
    /*    webSocket end   */
    /*--------显示遥测数据end-------------*/

    /*显示详情*/
    var num;//页数
    var size;//每页显示的数据个数，如果不设置，则最后一页少于pageSize后,再往前翻就只显示最后一页的数据个数
    $scope.showDetail = function () {

        //  终止时间默认是当前时间  
        var currentTime = Date.now();
        var currentUTC = getUTC(new Date(currentTime));
        $("#endTime").val(currentUTC);
        //   end  

    $("#historyEcharts").removeAttr("_echarts_instance_");//echarts表格重新加载前清除之前的init
    $("#historyEcharts").empty();//清空历史数据表
    //$("#startTime").val("");//清空起始时间
    //$("#endTime").val("");//清空终止时间
    $("#searchKey").val("");//清空搜索框
    $(".pagination li,#attrDisplay tr").remove();//清空属性展示列表和分页按钮
    $("#attrSelectInfo option:first").prop("selected","selected");
    var attrDetailObj = $resource("/api/dCtrPanel/getAllDeviceAttr/:deviceId");
    var attrDetailInfo = attrDetailObj.query({deviceId:$scope.deviceInfo.id},function (resp) {
        //console.log(resp);
        if(attrDetailInfo.length != 0){
            num = Math.ceil(attrDetailInfo.length / 5);
            size = 5;
            initUI(1,5);
        }else{
            num = 0;
            size = 0;
            initUI(0,0);
        }

    });


    /*按键值搜索*/
    $scope.findKey = function () {
        // console.log(attrDetailInfo[0].key);
        $("#attrDisplay tr").remove();
        var txt=$("#searchKey").val();
        var tag = 0;
        if(txt == ""){
            initUI(1,5);
        }else{
            for(var i = 0;i<attrDetailInfo.length;i++){
                if(attrDetailInfo[i].key == txt){
                    var latestTs = formatDate(new Date(attrDetailInfo[i].lastUpdateTs));
                    $("#attrDisplay").append('<tr>'+'<td class="list-item">'+latestTs+'</td>'+'<td class="list-item">'+attrDetailInfo[i].key+'</td>'+'<td class="list-item">'+attrDetailInfo[i].value+'</td>'+'</tr>')
                    tag++;
                }
            }
            if(tag == 0){
                $("#attrDisplay").append('<tr>'+'<td class="list-item">'+'</td>'+'<td class="list-item">'+'无此键值！'+'</td>'+'<td class="list-item">'+'</td>'+'</tr>')
            }

        }

    };

    // console.log(attrDetailInfo);//获取的所有数据，格式为[{},{}]

    /*==========显示属性==========*/
    //分页功能实现
    function initUI(pageNo, pageSize) {
        // console.log(pageNo);
        // console.log(pageSize);
        //pageNo 当前页号
        //pageSize 页面展示数据个数
        var html = '';
        for(var i=(pageNo-1)*size; i<((pageNo-1)*size+pageSize); i++) {
            // console.log(i+"|"+Number((pageNo-1)*size+pageSize));
            var item = attrDetailInfo[i];
            //console.log(attrDetailInfo[i]);
            var latestTs = formatDate(new Date(attrDetailInfo[i].lastUpdateTs));
            html += '<tr>'+'<td class="list-item">'+latestTs+'</td>'+'<td class="list-item">'+item.key+'</td>'+'<td class="list-item">'+item.value+'</td>'+'</tr>';
        }
        document.getElementsByClassName('data-list')[0].innerHTML = html;
        pagination({
            cur: pageNo,
            total: num,//总共多少页
            len: 5,//显示出来的点击按钮个数
            targetId: 'pagination',
            callback: function() {
                var me = this;
                var oPages = document.getElementsByClassName('page-index');
                for(var i = 0; i < oPages.length; i++) {
                    oPages[i].onclick=function() {
                        if(this.getAttribute('data-index')*pageSize>attrDetailInfo.length){
                            initUI(this.getAttribute('data-index'),pageSize-this.getAttribute('data-index')*pageSize+attrDetailInfo.length);
                        }else{
                            initUI(this.getAttribute('data-index'), size);
                        }
                    }
                }
                var goPage = document.getElementById('go-search');
                goPage.onclick = function() {
                    var index = document.getElementById('yeshu').value;
                    if(!index || (+index > me.total) || (+index < 1)) {
                        return;
                    }
                    //若不加此判断，pageSize仍为传进来的原值，若最后一页数值不够，则会产生undefined错误
                    if(pageSize*index > attrDetailInfo.length){
                        pageSize = attrDetailInfo.length-pageSize*(index-1);
                        initUI(index, pageSize);
                    }else{
                        initUI(index, size);
                    }

                }
            }
        });
    };
    //每次显示数据数量发生变化都重新分页
    $scope.showNum = function () {
        $(".pagination li,#attrDisplay tr").remove();//每次清空属性展示列表和分页按钮
        var limit = Number($("#attrSelectInfo option:selected").text());
        //使用.text()取出的数据是字符型！！！！
        num = Math.ceil(attrDetailInfo.length / limit);
        size = limit;
        initUI(1,limit);
    };
    /*===================================================================*/






    /*调用函数，显示遥测数据*/
    $('#realtime_data_table tr td').remove();//在显示遥测数据之前清空遥测数据表
    realtimeDevice($scope.deviceInfo.id);//建立websocket连接
    $("#modalCloseDetail,#modalConfirmDetail,#modalCloseTagDetail").click(function () {
        ws.close();
    });


    /*显示历史数据*/
    //获取起止时间
    $scope.subTime = function () {
        $("#historyEcharts").empty();//清空历史数据表
        $("#historyEcharts").removeAttr("_echarts_instance_");//echarts表格重新加载前清除之前的init
        if($("#startTime").val()==="" || $("#endTime").val()===""){
            toastr.warning("起始时间无效！");
        }else{
            var start = $("#startTime").val();
            var end = $("#endTime").val();
            var startStamp = new Date(start).getTime();
            var endStamp = new Date(end).getTime();
            if(startStamp > endStamp){
                toastr.warning("起始时间无效！");
            }else{
                console.log(start);
                console.log(startStamp);
                console.log(end);
                console.log(endStamp);

                var allKey;
                // console.log(allKey);
                $.ajax({
                    url:"/api/dCtrPanel/getAllKeys/"+$scope.deviceInfo.id,
                    type:"GET",
                    dataType:"json",
                    async:false,
                    success:function (msg) {
                        allKey = msg;//用于记录所有键值
                        console.log(allKey);

                    },
                    error:function (err) {
                        console.log(err);
                    }
                });
                // console.log(allKey);
                // console.log(allKey.length);
                /*
                historyValue[i][] --- allKey[i]
                historyTime是相同的
                */
                var historyValue = new Array();
                var historyTime = new Array();
                for(var i = 0;i < allKey.length;i++){
                    historyValue[i] = new Array();

                    // console.log("/api/data/getHistoricalData/"+$scope.deviceInfo.id+"?key="+allKey[i]+"&startTs="+startStamp+"&endTs="+endStamp+"&limit=1000");
                    $.ajax({
                        url:"/api/dCtrPanel/getHistoricalData/"+$scope.deviceInfo.id+"?key="+allKey[i]+"&startTs="+startStamp+"&endTs="+endStamp+"&limit=1000",
                        dataType:"json",
                        async:false,
                        type:"GET",
                        success:function (msg) {
                            console.log(msg);
                            /* //数据反向存储
                        for(var j =0,k=msg.length-1;j<msg.length,k>=0;j++,k--){
                                historyValue[i][j] = msg[k].value;
                                historyTime[j] = formatDate(new Date(msg[k].ts));
                            }*/
                            for(var j =0;j<msg.length;j++){
                                historyValue[i][j] = msg[j].value;
                                historyTime[j] = formatDate(new Date(msg[j].ts));
                            }
                            console.log(historyValue[i]);
                            console.log(historyTime);
                        },
                        error:function (err) {
                            console.log(err);
                        }
                    });
                }
            }


            /*series动态push*/
            var seriesArr = [];
            for(var i = 0;i<allKey.length;i++ ){
                seriesArr.push({
                    name:allKey[i],
                    type:'line',
                    data:historyValue[i]
                });
            }

            var myChart = echarts.init(document.getElementById('historyEcharts'));
            var option = {
                title: {
                    text: '历史数据'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:allKey,
                    right:20,
                    padding:10,
                    itemGap :20,

                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: historyTime,
                },
                yAxis: {
                    type: 'value',
                },
                series: seriesArr

            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);

        }


    };


    /*控制面板*/

    var abilityDesArr = new Array();//用于记录所有aibilityDes转换成json后的数据[{},{},...]
    var serviceName = new Array();//用于记录所有的serviceName
    var methodName = new Array();//用于记录所有的methodName
    $('#control_panel').empty();//每次将控制面板清空再渲染
    var controlObject = $resource("/api/dCtrPanel/getCtrPanel/:manufacturerName/:deviceTypeName/:modelName");
    $scope.controlInfo = controlObject.query({manufacturerName:$scope.deviceInfo.manufacture,deviceTypeName:$scope.deviceInfo.deviceType,modelName:$scope.deviceInfo.model});
    $scope.controlInfo.$promise.then(function (value) {



        console.log(value);

        for(var i = 0;i<value.length;i++){
            var abilityDesJson = JSON.parse(value[i].abilityDes);//将所有abilityDes（string）转成JSON
            abilityDesArr.push(abilityDesJson);//把abilityDesJson存进数组
            serviceName.push(abilityDesJson.serviceName);//用于记录所有的服务名（有多少个小控制面板）
            methodName.push(abilityDesJson.serviceBody.methodName);//用于记录所有的方法名，用于传回数据
            //注意：小控制面板、serviceName、methodName以及各控制按钮的id编号都是一一对应的（用i循环即可），这样方便取值


            //每个小控制面板的id为ctrlDiv{{i}}
            $('#control_panel').append('<div class="col-xs-10 col-sm-6 col-md-4 service-panel"><form><fieldset id="ctrlDiv' + i + '"><legend class="service-control-legend">' + serviceName[i] + '</legend></fieldset></form></div>');
            // console.log("serviceName:"+serviceName[i]);
            var params = abilityDesJson.serviceBody.params;//用于记录每一个小控制面板下有多少个控制选项,随i的取值变化而变化
            // console.log("params"+params);
            // console.log("params.length"+params.length);
            for(var j = 0;j < params.length;j++){
                // console.log(params[j]);
                // console.log(params[j].value);

                var type = params[j].type;//控制类型
                var key = params[j].key;//控制名称
                var valueInfo = params[j].value;//控制默认值或范围


                //每个小控制面板下的控制按钮id为parma
                if(type == 1){
                    $('#ctrlDiv' + i).append('<div class="form-group"><label class="col-sm-3 control-label" style="text-align: left;">' + key + '</label><div class="col-sm-9"><input type="text" class="form-control" id="param'+ i + j +'"  placeholder="' + valueInfo +'"/></div></div>');
                }
                else if(type == 2){
                    /*函数：split()
                    功能：使用一个指定的分隔符把一个字符串分割存储到数组*/
                    /* var temp = params[j].value.split(" ");
                    var leftStatus = temp[0];
                    var rightStatus = temp[1];
                    var curStatus = rightStatus;
                    console.log("0:"+temp[0]);
                    console.log("1:"+temp[1]);*/
                    /*var leftStatus = true;
                    var rightStatus = false;*/
                    $('#ctrlDiv' + i).append('<div class="form-group"><label class="col-sm-3 control-label" style="text-align: left;">' + key +  '</label><div class="col-sm-9"><image src="static/assets/img/off.png" id="param'+i+j+ '" style="cursor: pointer; width: 80px; height: 30px; margin: 0 10px;"></image></div></div>');
                /* var img = document.getElementById("param"+i+j);
                    img.setAttribute('on', true);
                    img.setAttribute('off', false);*/
                    $("#param"+i+j).click(function () {
                        if($(this).attr("src") == "static/assets/img/off.png"){
                            console.log("off->on");
                        /* $(this).removeClass();
                            $(this).addClass("true");*/
                            $(this).attr("src","static/assets/img/on.png");

                        }else{
                            console.log("on->off");
                        /*  $(this).removeClass();
                            $(this).addClass("false");*/
                            $(this).attr("src","static/assets/img/off.png");
                        }

                    });
                }
                else if(type == 3){

                    var temp = params[j].value.split(" ");
                    var lowerBound = temp[0];
                    var upperBound = temp[1];
                /* var lowerBound = 10;
                    var upperBound = 20;*/
                    // console.log(lowerBound);
                    // console.log(upperBound);
                    //html5标签 <input type="number" min="" max="" step="" value=""/>
                    $('#ctrlDiv' + i).append('<div class="form-group"><label class="col-sm-3 control-label" style="text-align: left;">' + key + '</label><div class="col-sm-9"><input type="number" class="form-control" id="param'+ i + j +'" name="rangeInput" min="' + lowerBound + '" max="' + upperBound + '" value="' + lowerBound +'" step="1"/><span>(' + lowerBound + '-' + upperBound + ')</span></div></div>');
                    console.log("number:"+$("#param"+i+j).val());
                }
            }
            $('#ctrlDiv' + i).append('<button class="btn btn-primary ctrlDivBtn" id="'+i+ '" type="button">应用</button>');

        }


        $(".ctrlDivBtn").on("click",function () {
            //注意二维数组的定义方式！！一定要定义在对应循环的上一层
            var valueArr = new Array();
            var keyArr = new Array();
            for(var i = 0;i<value.length;i++) {
                /*console.log("serviceName:" + serviceName[i]);
                console.log("methodName:" + methodName[i]);
                console.log("maxi:"+value.length);*/
                //console.log(abilityDesArr[i].serviceBody.params);
                var params = abilityDesArr[i].serviceBody.params;//用于记录每个serviceBody的params（随i变化而变化！！）
                /*console.log(params);*/
                //console.log(params.length+"----"+i);
                //console.log(abilityDesArr[i].serviceBody.params.length);
                valueArr[i] = new Array();
                keyArr[i] = new Array();

                for(var j = 0;j<params.length;j++){
                    // console.log(params[j].key);
                    // console.log(params[j].type);

                    if(params[j].type == 2){

                        if($("#param"+i+j).attr("src") == "static/assets/img/off.png"){
                            valueArr[i][j] = false;
                        }
                        else if($("#param"+i+j).attr("src") == "static/assets/img/on.png"){
                            valueArr[i][j] = true;
                        }
                    }
                    else{
                        valueArr[i][j] = $("#param"+i+j).val();
                    }
                    keyArr[i][j] = params[j].key;
                    // console.log("=========="+i+j+"=============");
                    // console.log("valueInfo:"+ valueArr[i][j]);
                    // console.log("key:"+ keyArr[i][j]);
                    // console.log("==========="+i+j+"============");

                }
                // console.log(abilityDesArr[i].serviceBody.params.length);
            }


            console.log(this.id);
            var index = this.id;
            // console.log(serviceName[index]);
            // console.log(methodName[index]);
            // var jsonObj = {};
            var keys = [];
            var values = [];
            keys.push("serviceName");
            values.push(serviceName[index]);
            keys.push("methodName");
            values.push(methodName[index]);
            for(var i = 0;i < abilityDesArr[index].serviceBody.params.length;i++){
                var type = document.getElementById("param"+index+i).tagName;
                if(type == "IMG"){
                    var tag = $("#param"+index+i).attr("src");
                    if(tag == "static/assets/img/off.png"){
                        valueArr[index][i] = false;
                    }else if(tag == "static/assets/img/on.png"){
                        valueArr[index][i] = true;
                    }
                }

                keys.push(keyArr[index][i]);
                values.push(valueArr[index][i]);
                // console.log("value"+index+i+":"+valueArr[index][i]);
                // console.log("key"+index+i+":"+keyArr[index][i]);
                var json = '{';
                for (var j = 0; j < keys.length; j++) {
                    json += '"' + keys[j] +'":"' + values[j] + '",';
                }
                json = json.slice(0,json.length-1);
                json += '}';
            }
            console.log("json:"+json);
            console.log( $scope.deviceInfo.id);
        /* var subObj = $resource("/api/shadow/control/:deviceId");
            var subInfo = subObj.save({deviceId:$scope.deviceInfo.id},json);
            console.log(subInfo);*/
            $.ajax({
                url:"/api/dCtrPanel/sendControl/"+$scope.deviceInfo.id,
                data:json,
                contentType: "application/json; charset=utf-8",//post请求必须
                dataType:"text",
                type:"POST",
                success:function(msg){
                    toastr.success("应用成功！");
                },
                error:function (err) {
                    toastr.error("应用失败！");
                }
            });
        });
    });

    };

}]);
