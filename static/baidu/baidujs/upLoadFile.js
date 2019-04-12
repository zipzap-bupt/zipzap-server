////////////////////上传文件/////////////////////
var file
function fileSelected() {  
 file= document.getElementById('fileToUpload').files[0];  
 if (file) {  
    $("#modelName").val(file.name);  
 }  
}

function uploadFile() { 
  // console.log(file)
  // console.log($("#fileToUpload").val())
  var index = file.name.lastIndexOf(".");
  var fileType = file.name.substring(index + 1, file.name.length);
  console.log("文件类型："+fileType);
  if(file.name.indexOf("%") != -1)
  {
    toastr.warning('文件名中不得包含%')
  }
  else if(file.size>1024*1024*200)
  {
    toastr.warning('请上传小于200M文件')
  }
  else if(fileType != "drc"&&fileType !="obj"&&fileType !="max"&&fileType !="glft") 
  {
    toastr.warning("请上传drc、obj、max或gltf文件")
  }
  else
  {
    var fd = new FormData();  
    fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]); 
    console.log(fd) 
    $.ajax({  
                url: "/api/uploadScene"+"?tenantId="+tenantId+"&siteId="+$('#siteId') .val(),  
                type: "POST",  
                data:fd,
                contentType: false,//必须false才会自动加上正确的Content-Type  
                processData: false,//必须false才会避开jQuery对 formdata 的默认处理  
                xhr: function(){ //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数    
                    myXhr = $.ajaxSettings.xhr();    
                if(myXhr.upload){ //检查upload属性是否存在    
                    //绑定progress事件的回调函数    
                    myXhr.upload.addEventListener('progress',uploadProgress, false);     
                }    
                return myXhr; //xhr对象返回给jQuery使用    
                },  
                success: function (evt) { 
                    console.log(evt.url);
                    toastr.warning('上传成功');
                    $('#addSences').modal('hide');
                    $.ajax({
                            url: '/api/siteUrl/'+$('#siteId') .val(),
                            data:
                                {url:evt.url},
                            type: 'put',//提交方式
                            dataType: 'JSON',//返回字符串，T大写
                            // contentType: 'application/json;',
                            error:function(){
                                toastr.error('失败');
                            },
                            success: function(req) {
                                console.log(req);
                                //请求成功时处理                      
                            }
                           });
                    }, 
                error: function (error) {  
                    toastr.error(error.responseJSON.message);  
                }  
        }); 
        }
        // $('#modelName').val("");
        // $('#fileToUpload').val("");
        // $('#progressNumber').val("");
}
//上传进度 
function uploadProgress(evt) {  
if (evt.lengthComputable) {  
  var percentComplete = Math.round(evt.loaded * 100 / evt.total);
  var pg=document.getElementById('progressNumber');
  //console.log(percentComplete);
  //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%'; 
  if(pg.style.width!="100%") pg.style.width = Math.round(evt.loaded / evt.total * 100) + "%";//进度条
  else pg.style.width=0; 
}  
else {  
    toastr.warning('无法上传');
}  
}

// function uploadFile1() { 
// //$('#addSences').modal('show'); 
// var fd = new FormData();  
// fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);  
// var xhr = new XMLHttpRequest();  
// xhr.upload.addEventListener("progress", uploadProgress, false);  
// xhr.addEventListener("load", uploadComplete, false);  
// xhr.addEventListener("error", uploadFailed, false);  
// xhr.addEventListener("abort", uploadCanceled, false);  
// xhr.open("POST", "/api/uploadScene");//修改成自己的接口  
// xhr.send(fd);  
// } 
  
// function uploadComplete(evt) {  
// /* 服务器端返回响应时候触发event事件*/  
// alert(evt.target.responseText); 
// // console.log(evt);
// // console.log(evt.target.response);
// // console.log($.parseJSON( evt.target.response ));
// // console.log($.parseJSON( evt.target.response ).url);
// $('#addSences').modal('hide');
// $.ajax({
//         url: 'api/siteUrl/'+$('#siteId') .val(),
//         data:
//             {url:$.parseJSON( evt.target.response ).url},
//         type: 'put',//提交方式
//         dataType: 'JSON',//返回字符串，T大写
//         // contentType: 'application/json;charset=UTF-8',

//         error:function(){
//             alert('失败');
//         },
//         success: function(req) {
//             console.log(req);
//             //请求成功时处理
  
//                }
           
//        });
// //document.getElementById("div1").style.display="none"; 
// }  
// function uploadFailed(evt) {  
// alert("There was an error attempting to upload the file.");  
// }  
// function uploadCanceled(evt) {  
// alert("The upload has been canceled by the user or the browser dropped the connection.");  
// }  
