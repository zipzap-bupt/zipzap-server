


if (!Detector.webgl) Detector.addGetWebGLMessage();
   var addmodel = new AddModel();
    
    var camera, scene, renderer,
        bulbLight, bulbMat, ambientLight,
        object, loader, stats,firstScene,orbitctr;

    THREE.DRACOLoader.setDecoderPath('../draco_decoder.js');
    THREE.DRACOLoader.setDecoderConfig( { type: 'js' } );
    THREE.DRACOLoader.getDecoderModule();
    var dracoLoader = new THREE.DRACOLoader();

    var ballMat, cubeMat, floorMat;
    var newcontrols;
    var objects = [];
    var transformcontrol;
    var boxmesh2;
    var temp, isdb;
    var vertex = new THREE.Vector3();
    var color = new THREE.Color();
    var floorMaterial;
    var pointerLock;
    //var raycaster;

    //==========pointerLock============变量
    var controlsEnabled = false;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();
    var direction = new THREE.Vector3();
    var vertex = new THREE.Vector3();
    var color = new THREE.Color();
    //========================================end
    
    
    var bulbLuminousPowers = {
        "110000 lm (1000W)": 110000,
        "3500 lm (300W)": 3500,
        "1700 lm (100W)": 1700,
        "800 lm (60W)": 800,
        "400 lm (40W)": 400,
        "180 lm (25W)": 180,
        "20 lm (4W)": 20,
        "Off": 0
    };
    // ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
    var hemiLuminousIrradiances = {
        "0.0001 lx (Moonless Night)": 0.0001,
        "0.002 lx (Night Airglow)": 0.002,
        "0.5 lx (Full Moon)": 0.5,
        "3.4 lx (City Twilight)": 3.4,
        "50 lx (Living Room)": 50,
        "100 lx (Very Overcast)": 100,
        "350 lx (Office Room)": 350,
        "400 lx (Sunrise/Sunset)": 400,
        "1000 lx (Overcast)": 1000,
        "18000 lx (Daylight)": 18000,
        "50000 lx (Direct Sun)": 50000,
    };
    var fogColor = {
        '红色': 0xff0000,
        '黄色': 0xffff00,
        '绿色': 0x00ff00
    }
    var params = {
        near: 1,
        far: 20,
        fogColor: Object.keys(fogColor)[0],
        "雾浓度": 0.02,
        shadows: false,
        exposure: 0.8,
        opacity:0.7,
        bulbPower: Object.keys(bulbLuminousPowers)[2],
        hemiIrradiance: Object.keys(hemiLuminousIrradiances)[3]
    };

    //获取search中的参数
    function getQueryString(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); return null; 
        } 
    
    function screenCoord(position){  //输入物体世界坐标，返回屏幕top，left

        let vec2 = position.project(camera);
        let halfWidth = window.innerWidth / 2;
        let halfHeight = window.innerHeight / 2;
        
        var result = {
            top: -vec2.y * halfHeight + halfHeight,
            left: vec2.x * halfWidth + halfWidth,
        }
        return result;
        }  


    var _sceneLoca = null;    //场景位置信息
    var _sceneUrl ;     //场景模型url
    var siteId = null;        //站点ID 
    var siteName = null;      //站点名称
    var tenantId = null;      //租户ID
    var showAllLabel = false;
    var allLabelDiv = [];
    


    var initScene = function(){

        siteId = getQueryString("siteId");   //从url中读取siteId
        tenantId = getQueryString("id") || getQueryString("tenantId") || $.cookie("tenant_id");

        if(siteId === null || siteId === "" || siteId === undefined){
            siteId = 1;      //默认是demo中的815场景
        }
        if(tenantId === null || tenantId === "" || tenantId === undefined){
            tenantId = 2;      //默认tenantId = 2
        }
        if( siteId !== null ) {
         //获取站点场景模型的初始位置信息
            $.ajax({
                url: '/api/sites/' + siteId,
                type: 'GET',
                async:false,
                success: function(res){
                    _sceneLoca =  res.sites[0].sceneModelLoca;
                    _sceneUrl = res.sites[0].sceneUrl;
                    siteName = res.sites[0].name;
                    
                    addmodel.addAllModel(siteId);    //加载场景ID133的所有设备模型
                },
                error: function(e){
                    $.alert('场景模型初始位置信息获取失败！请刷新重试'+ e.message);
                }
            });

            $("#title").html("站点名称:  "+siteName);
        } 
        
    }
    initScene();

    if(_sceneUrl === "" || _sceneUrl === null || _sceneUrl === undefined){
        $.alert("您未上传任何场景模型，请返回地图界面进行上传。");
    }

    if(_sceneLoca === null || _sceneLoca === "" || _sceneLoca === undefined){
        _sceneLoca ={
            position:{},
            rotation:{},
            scale:{},
        };
    }else{
        _sceneLoca = JSON.parse(_sceneLoca);
    }
    
    var sceneCtrl = {
        
        "平移-x": Number(_sceneLoca.position.x) || 5 ,
        "平移-y": Number(_sceneLoca.position.y) || 2,
        "平移-z": Number(_sceneLoca.position.z) || 0.01,
        "旋转-x": Number(_sceneLoca.rotation.x) || 0.01,
        "旋转-y": Number(_sceneLoca.rotation.y) || 0.01,
        "旋转-z": Number(_sceneLoca.rotation.z) || 0.01,
        "缩放": Number(_sceneLoca.scale.x) || 0.5,
    };
    var newcontrols = {

        "清除物体": function() {
            objects.forEach(function(e) {
                scene.remove(e);
            });
            objects = [];
        },
        "上传设备模型": function() {
            window.open("/demoupload", "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=no, resizable=no, copyhistory=yes, width=400, height=360")
        },  //upload/upload.html,原来.open()中的内容

        "显示/关闭所有标签": function() {
            if(showAllLabel === false){
                showAllLabel = true;
            }else{
                showAllLabel =false;
            }

            //clone label div
            if(allLabelDiv.length === 0){
                objects.forEach(function(e) {
                            
                    let position = e.position.clone();
                    let result = screenCoord(position);
                    let top = result.top + 5 + "px";
                    let left = result.left + 5 + "px";
                    var tempdiv = $("#tip").clone().css({
                        left: left,
                        top: top,
                        display:"none"
                    });
                    let cont = "设备名称:"+e.deviceName+"<br>设备ID:"+e.deviceId+"<br>标签:"+e.label;
                    tempdiv.html("<p>" + cont + "</p>");
                    e.tipdiv = tempdiv;
                    allLabelDiv.push(tempdiv);
                    console.log(e);
                    $("body").append(tempdiv);
                });
            }
             //end
        
            allLabelDiv.forEach(function(e){
                if(showAllLabel){
                    e.css({
                        display:'block'
                    });
                }else{
                    e.css({
                        display:'none'
                    });
                }
            });
            
        },
        "☆返回首页": function() {
            var search = window.location.search;
            window.location.href= '/'+search;
        },

        "✔保存场景设置": function() {
            $.confirm({
                title:"Confirm!",
                content:'确认修改场景位置信息吗？',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-danger',
                closeIcon: true,
                animation:'rotateY',
                closeAnimation: 'rotateY',
                confirm: function(){
                    var sceneLocation = {
                        position:{
                            x:sceneCtrl['平移-x'].toFixed(6),
                            y:sceneCtrl['平移-y'].toFixed(6),
                            z:sceneCtrl['平移-z'].toFixed(6),
                        },
                        scale:{
                            x:sceneCtrl['缩放'].toFixed(6),
                            // y:sceneCtrl['缩放'].toFixed(6),
                            // z:sceneCtrl['缩放'].toFixed(6),
                        },
                        rotation:{
                            x:sceneCtrl['旋转-x'].toFixed(6),
                            y:sceneCtrl['旋转-y'].toFixed(6),
                            z:sceneCtrl['旋转-z'].toFixed(6),
                        },
                        opacity:params.opacity.toFixed(6)
                    };
        
                    //var siteId = 133;
        
                    $.ajax({
                        url:'/api/sites/sceneModelLoca/'+ siteId,
                        type:'PUT',
                        data:{
                            "location":JSON.stringify(sceneLocation)
                        },
                        async:false,
                        success: function(res){
                            if(res[0] === 1){
                                $.alert("成功更新场景模型位置信息！");
                            } else{
                                $.alert("场景模型位置信息更新失败！请重试");
                            }
                        },
                        error: function(e){
                            $.alert("更新位置失败！可能是数据库问题~"+e.message);
                        }
                    });
                }

            });
            

        }
    };

    var transfctrl = {
        "轨道控件": function(){
            var controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.maxPolarAngle = Math.PI * 9 / 20;
            // controls.target.set(0, 2, 0);
            controls.update();
        },
        "轨迹球控件": function(){   //未搞定
            var trballctr = new THREE.TrackballControls( camera );
                trballctr.rotateSpeed = 1.0;
                trballctr.zoomSpeed = 1.2;
                trballctr.panSpeed = 0.8;

                trballctr.noZoom = false;
                trballctr.noPan = false;

                trballctr.staticMoving = true;
                trballctr.dynamicDampingFactor = 0.3;

                trballctr.keys = [ 65, 83, 68 ];

                trballctr.addEventListener( 'change', render );

        },
        "行走漫游": function(){   //搞定
                //==================18.7.4test======================
                var blocker = document.getElementById( 'blocker' );
                var instructions = document.getElementById( 'instructions' );

                var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
                if ( havePointerLock ) {

                    var element = document.body;
    
                    var pointerlockchange = function ( event ) {
    
                        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
    
                            controlsEnabled = true;
                            pointerLock.enabled = true;
    
                            blocker.style.display = 'none';
    
                        } else {
    
                            pointerLock.enabled = false;
    
                            blocker.style.display = 'inline-block';
    
                            instructions.style.display = '';
    
                        }
    
                    };
    
                    var pointerlockerror = function ( event ) {
    
                        instructions.style.display = '';
    
                    };
    
                    // Hook pointer lock state change events
                    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
                    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
                    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    
                    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
                    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
                    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
    
                    instructions.addEventListener( 'click', function ( event ) {
    
                        instructions.style.display = 'none';
    
                        // Ask the browser to lock the pointer
                        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                        element.requestPointerLock();
    
                    }, false );
    
                } else {
    
                    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    
                }
                //==================endtest=========================

                pointerLock = new THREE.PointerLockControls( camera );
                scene.add( pointerLock.getObject() );
                var onKeyDown = function ( event ) {

					switch ( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = true;
							break;

						case 37: // left
						case 65: // a
							moveLeft = true; break;

						case 40: // down
						case 83: // s
							moveBackward = true;
							break;

						case 39: // right
						case 68: // d
							moveRight = true;
							break;

						case 32: // space
							if ( canJump === true ) velocity.y += 350;
							canJump = false;
							break;

					}

				};

				var onKeyUp = function ( event ) {

					switch( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = false;
							break;

						case 37: // left
						case 65: // a
							moveLeft = false;
							break;

						case 40: // down
						case 83: // s
							moveBackward = false;
							break;

						case 39: // right
						case 68: // d
							moveRight = false;
							break;

					}

				};

				document.addEventListener( 'keydown', onKeyDown, false );
                document.addEventListener( 'keyup', onKeyUp, false );
                //raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

        },
    };
    function setPosAndShade(obj) {
        /*obj.position.set(
         Math.random() * 20 - 45,
         40,
         Math.random() * 20 - 5
         );*/
        obj.position.set(0, 0, 0);
        obj.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
        obj.castShadow = true;
    }
    var raycaster = new THREE.Raycaster();
    var craycaster = new THREE.Raycaster();    //用于坐标的拾取
    var mouse = new THREE.Vector2();
    var clock = new THREE.Clock();
    init();
    animate();
    //tips and show tips
    var ToolTip = {
        init: function() {
            var tempDiv = document.getElementById("tip");
            
            tempDiv.style.display = "none";
            tempDiv.style.position = "absolute";
            tempDiv.style.color = "#fff";
            tempDiv.style.borderRadius = 2 + "px";
            tempDiv.style.padding = 2 + "px";
            tempDiv.style.backgroundColor = "rgba(0,0,0,0.4)";          
        },
        showtip: function(mouse, cont) {
            jqq("tip").innerHTML = "<p>" + cont + "</p>";
            jqq("tip").style.left = mouse.clientX + 5 + "px";
            jqq("tip").style.top = mouse.clientY - 10 + "px";
            jqq("tip").style.zIndex = "10";
            jqq("tip").style.display = "block";
        },
        hidetip: function() {
            jqq("tip").style.display = "none";
        }
    }
    var jqq = function(str) {
        return document.getElementById(str);
    }
    ToolTip.init();
    //
    function init() {
        var container = document.getElementById('container');
        // stats = new Stats();
        // container.appendChild(stats.dom);
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 0;
        camera.position.z = 15;
        camera.position.y = 8;
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xffffff, 0);
        //scene.background = new THREE.Color( 0xffffff );
        //半光
        hemiLight = new THREE.HemisphereLight(0x363636, 0x363636, 0.5);
        scene.add(hemiLight);

        var ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
        //坐标辅助
        var axes = new THREE.AxesHelper(100);
        scene.add(axes);
        
        //地板
        floorMat = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            color: 0xffffff,
            metalness: 0.2,
            bumpScale: 0.0005,
        });
        var floorGeometry = new THREE.PlaneBufferGeometry(500, 500);
        var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = -Math.PI / 2.0;
        scene.add(floorMesh);

        //==============新地板测试======================
            // var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
            //         floorGeometry.rotateX( - Math.PI / 2 );

            //         // vertex displacement

            //         var position = floorGeometry.attributes.position;

            //         for ( var i = 0; i < position.count; i ++ ) {

            //             vertex.fromBufferAttribute( position, i );

            //             vertex.x += Math.random() * 20 - 10;
            //             vertex.y += Math.random() * 2;
            //             vertex.z += Math.random() * 20 - 10;

            //             position.setXYZ( i, vertex.x, vertex.y, vertex.z );

            //         }

            //         floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

            //         count = floorGeometry.attributes.position.count;
            //         var colors = [];

            //         for ( var i = 0; i < count; i ++ ) {

            //             color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            //             colors.push( color.r, color.g, color.b );

            //         }

            //         floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

            //         floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

            //         var floor = new THREE.Mesh( floorGeometry, floorMaterial );
            //         scene.add( floor );
        //===========================endtest=======================

         //点光源设置
        var bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
        var bulbLight = new THREE.PointLight(0xffee88, 999, 100, 2);
        var bulbMat = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 100,
            color: 0xffffff
        });
        bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
        bulbLight.position.set(0, 4, 0);
        bulbLight.castShadow = true;
        scene.add(bulbLight);
        /* 第二个点光源 */
        var bulbGeometry2 = new THREE.SphereGeometry(0.02, 16, 8);
        var bulbLight2 = new THREE.PointLight(0xffee88, 999, 100, 2);
        var bulbMat2 = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 100,
            color: 0xffffff
        });
        bulbLight2.add(new THREE.Mesh(bulbGeometry2, bulbMat2));
        bulbLight2.position.set(-15, 4, 0);
        bulbLight2.castShadow = true;
        scene.add(bulbLight2);
        /* 第三个点光源 */
        var bulbGeometry3 = new THREE.SphereGeometry(0.02, 16, 8);
        var bulbLight3 = new THREE.PointLight(0xffee88, 999, 100, 2);
        var bulbMat3 = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 100,
            color: 0xffffff
        });
        bulbLight3.add(new THREE.Mesh(bulbGeometry3, bulbMat3));
        bulbLight3.position.set(10, 4, 0);
        bulbLight3.castShadow = true;
        scene.add(bulbLight3);

        //渲染器设置
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.physicallyCorrectLights = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.setClearColor(0x363636);  /*设置环境的背景色 */

        //轨道控件
        transfctrl["轨道控件"]();     //两种控制方式同时使用

        //漫游
        transfctrl["行走漫游"]();

        // orbitctr = new THREE.OrbitControls(camera, renderer.domElement);
        // orbitctr.maxPolarAngle = 2*Math.PI;
        // // controls.target.set(0, 2, 0);
        // orbitctr.minDistance = 0;
        // orbitctr.maxDistance = 1000;
        

        //改变模型形状
        transformcontrol = new THREE.TransformControls(camera, renderer.domElement);
        //transformcontrol.addEventListener('change', render);
        scene.add(transformcontrol);

        //加载实验室模型
        var onProgress = function(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                var process_loading = 'Loading Models:'+Math.round(percentComplete, 2) + '%';
                document.getElementById('Loading').innerHTML = process_loading;
                console.log(process_loading);
                if(percentComplete == 100){
                document.getElementById('Loading').style.display = 'none';
            }
            }
        };
        var onError = function(xhr) {
            $.alert("找不到该站点模型文件\n  错误信息:"+xhr.target.statusText);
            
        };

        //原路径：static/gis_815/models/mydrc/lab_524drc.drc
        
            dracoLoader.load( _sceneUrl, function ( geometry ) {
                
            geometry.computeVertexNormals();

            var material = new THREE.MeshStandardMaterial( { vertexColors: THREE.VertexColors } );
            var mesh = new THREE.Mesh( geometry, material );
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //mesh.material.side = THREE.DoubleSide;

            mesh.scale.x = 0.5;
            mesh.scale.y = 0.5;     /*  改变几何的比例*/ 
            mesh.scale.z = 0.5;
            mesh.position.x = 5;
            mesh.position.y = 2;     /*  改变几何的位置*/ 
            mesh.position.z = 0;
            mesh.material.transparent = true;
            mesh.material.opacity = params.opacity;
            // console.log(mesh.getWorldPosition());
            firstScene = mesh;
            scene.add( mesh );

            // Release the cached decoder module.
            THREE.DRACOLoader.releaseDecoderModule();
            },onProgress, onError);

        //
        window.addEventListener('resize', onWindowResize, false);
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        renderer.domElement.addEventListener('dblclick', onDocumentDbclick, false);
        

        var gui = new dat.GUI();
        gui.add(params, 'exposure', 0, 1);
        gui.add(params, 'opacity', 0, 1);
        effectController = {
            shininess: 40.0
        }

        // h = gui.addFolder("雾颜色");
        // h.add(params, "fogColor", Object.keys(fogColor));
        // gui.add(params, '雾浓度', 0, 0.1);

        //场景模型控制
        var scectr = gui.addFolder("场景模型变换");
        scectr.add(sceneCtrl,"平移-x",-50, 50);
        scectr.add(sceneCtrl,"平移-y",-30,30 );
        scectr.add(sceneCtrl,"平移-z",-50, 50);
        scectr.add(sceneCtrl,"旋转-x",0, 2*Math.PI);
        scectr.add(sceneCtrl,"旋转-y",0, 2*Math.PI);
        scectr.add(sceneCtrl,"旋转-z",0, 2*Math.PI);
        scectr.add(sceneCtrl,"缩放",0,2);

        //控制方式
        var transctrl = gui.addFolder("场景控制方式");
        transctrl.add(transfctrl,"轨道控件");
        //transctrl.add(transfctrl,'轨迹球控件');  未完成
        transctrl.add(transfctrl,'行走漫游');
        

        gui.add(newcontrols, '清除物体');
        // gui.add(newcontrols, '上传设备模型');
        gui.add(newcontrols,'显示/关闭所有标签');
        gui.add(newcontrols,'☆返回首页');
        gui.add(newcontrols,'✔保存场景设置');
        gui.open();
        
    }
    var baseColor = 0xFF0000;
    var foundColor = 0x12C0E3;
    var intersectColor = 0x00D66B;
    var intersected;
    var downIntersected;


        //fun2cgq('sensor_center.stl',-10.37, 6.90, 15.16,"开关1开_uid1_on");
        //fun2cgq('sensor_center.stl',-10.37, 6.90, 14.16,"开关1关_uid1_off");
        //fun2cgq('sensor_center.stl',0.0, 4.228, -6.5,"窗帘1开_uid3_on");
        //fun2cgq('sensor_center.stl',-1.0, 4.228, -6.5,"窗帘1关_uid3_off");
        //fun2cgq('sensor_center.stl',0.0,4.96,18,"温湿2_uid4");
        
        
        
        
        


    function onDocumentDbclick(event){
        event.preventDefault(); 
        var vector = new THREE.Vector3();//三维坐标对象 
        vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 ); 
        vector.unproject( camera ); 
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize()); 
        var intersects = raycaster.intersectObjects(scene.children); 
        if (intersects.length > 0) 
        { var selected = intersects[0];//取第一个物体 
            var str = "x坐标:"+selected.point.x.toFixed(6) 
                + "<br>"+"y坐标:"+selected.point.y.toFixed(6)+"<br>"+"z坐标:"+selected.point.z.toFixed(6);
            document.getElementById('coords').innerHTML = str; 
            document.getElementById('coords').style.display = '';
            console.log(intersects.length); 
            //在mainCtrl.js中绑定前端input
            if($("#addModel").css("display")=="none") {
                
            }else{
                jQuery('#xValue').val(selected.point.x.toFixed(6));
                jQuery('#yValue').val(selected.point.y.toFixed(6));
                jQuery('#zValue').val(selected.point.z.toFixed(6));
                jQuery('#xValue-s').val(selected.point.x.toFixed(6));
                jQuery('#yValue-s').val(selected.point.y.toFixed(6));
                jQuery('#zValue-s').val(selected.point.z.toFixed(6));
            }
        }

    }

    function onDocumentMouseDown(event) {
        event.preventDefault();    
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        //var octreeObjects;
        var numObjects;
        //var numFaces = 0;
        var intersections;
        intersections = raycaster.intersectObjects(objects);
        numObjects = objects.length;
        //numFaces = totalFaces;
        
        //console.log("dijichangdu :"+intersections.length)
        if (intersections.length > 0) {
                var deviceName =  intersections[0].object.deviceName;
                var deviceId = intersections[0].object.deviceId;
                var label = intersections[0].object.label;
                downIntersected = intersections[0].object;
    
                if (event.button === 2){
                    window.addEventListener('keydown', changeMode);
                    event.preventDefault();
                    transformcontrol.attach(downIntersected);

                }else{
                     //==================点击设备显示控制面板=========
                     //外部js代码调用angular内部$scope的变量和函数

                    var appElement = $('[ng-controller=deviceCtrPanel]');
                    var $scope = angular.element(appElement).scope();

                    $.ajax({
                        url:'/api/3d815/getDeviceInfo/'+ deviceId,
                        type:'GET',
                        async:false,
                        success: function(res){
                            $scope.deviceInfo = res;
                        },
                        error: function(e){
                            console.log(e.message);
                        }
                    });

                    $('#deviceDetail').modal('show');     //控制面板触发仅此一行代码
                    $scope.showDetail();

                    
                    

                    
                    //=============================================

                // if(nameUid[0].indexOf("窗帘")!=-1){
                //     getAjax("/api/3d815/controlCurtain/"+nameUid[1]+'?turn='+nameUid[2], function(response) {
                        
                //         console.log('窗帘结果:'+response);
                //         if (response.indexOf("on")!=-1){
                //             params.exposure = 0.81;
                //         }else if (response.indexOf("off")!=-1){
                //             params.exposure = 0.68
                //         }else {
                //             alert("控制失败！"+response);
                //         }
                //     });
                // }else if (nameUid[0].indexOf("开关")!=-1){
                //     getAjax("/api/3d815/controlSwitch/"+nameUid[1]+'?turn='+nameUid[2], function(response) {
                        
                //         console.log('开关结果:'+response);
                //         if (response.indexOf("on")!=-1){
                //             params.exposure = 0.81;
                //         }else if (response.indexOf("off")!=-1){
                //             params.exposure = 0.68
                //         }else {
                //             alert("控制失败！"+response);
                //         }
                //         });
                // }
                }                                                                                             
                }                                                
    }

    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        //var octreeObjects;
        var numObjects;
        var intersections;
        intersections = raycaster.intersectObjects(objects);
        numObjects = objects.length;
        
        if (intersections.length > 0) {
            if (intersected != intersections[0].object) {
                if (intersected) intersected.material.color.setHex(baseColor);
                
                intersected = intersections[0].object;
                intersected.material.color.setHex(intersectColor);

                var deviceName =  intersected.deviceName;
                var deviceId = intersected.deviceId;
                var label = intersected.label;
              
            //    if(nameUid[0].indexOf("开关")!=-1){
            //        ToolTip.showtip(event, nameUid[0]+":");
            //    }else if(nameUid[0].indexOf("窗帘")!=-1){
            //        ToolTip.showtip(event, nameUid[0]+":");
            //    }
            //     else if(nameUid[0].indexOf("温湿")!=-1){
            //        getAjax("/api/3d815/getdata/"+nameUid[1], function(response) {
            //            var data = JSON.parse(response);
            //            var temp = (parseFloat((data.res[1].value))/100).toFixed(2);
            //            var humidity = parseFloat(data.res[0].value).toFixed(2);
            //            console.log(temp);
            //            ToolTip.showtip(event, nameUid[0]+"<br>temp:"+temp+"℃<br>humitity:"+humidity);
            //        });
            //    }else {
            //     ToolTip.showtip(event, "设备名称:"+deviceName+"<br>设备ID:"+deviceId+"<br>标签:"+label);
            //     // $('#showDeviceInfo').css({'display':''});
                
            //    }
               ToolTip.showtip(event, "设备名称:"+deviceName+"<br>设备ID:"+deviceId+"<br>标签:"+label);

            }

            document.body.style.cursor = 'pointer';
        } else if (intersected) {
            intersected.material.color.setHex(baseColor);
            intersected = null;
            document.body.style.cursor = 'auto';
            //transformcontrol.detach();
            //window.removeEventListener("keydown", changeMode)
            // if(!showAllLabel)
                ToolTip.hidetip();
            // $('#showDeviceInfo').css({'display':'none'});
        }
    }
    function alt() {
        window.open("./camera/camera.html", "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=no, resizable=no, copyhistory=yes, width=920, height=500")
    }
    function changeMode() {
        switch (event.keyCode) {
            case 81: // Q
                transformcontrol.setMode("translate");
                break;
            case 87: // W
                transformcontrol.setMode("rotate");
                break;
            case 69: // E
                transformcontrol.setMode("scale");
                break;
            case 27: //esc
                transformcontrol.detach();
                window.removeEventListener("keydown", changeMode);
                break;
            case 187:
            case 107: // +, =, num+
                transformcontrol.setSize( transformcontrol.size + 0.1 );
                break;
            case 189:
            case 109: // -, _, num-
                transformcontrol.setSize( Math.max( transformcontrol.size - 0.1, 0.1 ) );
                break;
        }
    }
    function onWindowResize() {   //屏幕自适应
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    //
    function animate() {   //递归渲染
        requestAnimationFrame(animate);
        render();
    }
    var previousShadowMap = false;
    function render() {   //渲染
        renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
        renderer.shadowMap.enabled = params.shadows;
        if (firstScene !== undefined){        //控制调节场景模型透明度,旋转,缩放
            firstScene.material.opacity = params.opacity;
            firstScene.position.x = sceneCtrl["平移-x"];
            firstScene.position.y = sceneCtrl["平移-y"];
            firstScene.position.z = sceneCtrl["平移-z"];
            firstScene.rotation.x = sceneCtrl["旋转-x"];
            firstScene.rotation.y = sceneCtrl["旋转-y"];
            firstScene.rotation.z = sceneCtrl["旋转-z"];
            var _scale = sceneCtrl["缩放"];
            firstScene.scale.x = _scale;
            firstScene.scale.y = _scale;
            firstScene.scale.z = _scale;
        }

            //新地板材质
            // if (params.shadows !== previousShadowMap) {

            //     floorMaterial.needsUpdate = true;
            //     //previousShadowMap = params.shadows;
            // }
        var foo = function(){
                    
                    var onObject = false;

					var time = performance.now();
					var delta = ( time - prevTime ) / 3000;     //可以控制移动速度

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveLeft ) - Number( moveRight );
					direction.normalize(); // this ensures consistent movements in all directions

					if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
					if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

					if ( onObject === true ) {

						velocity.y = Math.max( 0, velocity.y );
						canJump = true;

					}

					pointerLock.getObject().translateX( velocity.x * delta );
					pointerLock.getObject().translateY( velocity.y * delta );
					pointerLock.getObject().translateZ( velocity.z * delta );

					if ( pointerLock.getObject().position.y < 100 ) {

						velocity.y = 0;
						pointerLock.getObject().position.y = -2;   //相机Y轴位置

						canJump = true;

					}

					prevTime = time;
        }
        foo();   //漫游动画函数
       
        var time = Date.now() * 0.0005;
        var delta = clock.getDelta();

        /*更新所有标签位置 */
        if(allLabelDiv.length !== 0){
            objects.forEach(function(e) {
                    
                let position = e.position.clone();
                let result = screenCoord(position);
                let top = result.top + 5 + "px";
                let left = result.left + 5 + "px";
                e.tipdiv.css({
                    left: left,
                    top: top,
                });
                
            });
        }
        /**end */

        renderer.render(scene, camera);
        // stats.update();
    }
    
    var fog = {
        scenefog: null,
        twinkleWarning: function(scene) {
            scene.fog = new THREE.FogExp2(0xffff00, 0.02);
            this.scenefog = setInterval(function() {
                var density = scene.fog.density
                if (density !== 0) {
                    scene.fog.density = 0;
                } else scene.fog.density = 0.02;
            }, 800);
        },
        clear: function(scene) {
            clearInterval(this.scenefog);
            scene.fog.density = 0;
        }
    }
    function createXMLHTTPRequest() {   //用于在后台与服务器交换数据
        //1.创建XMLHttpRequest对象
        //这是XMLHttpReuquest对象无部使用中最复杂的一步
        //需要针对IE和其他类型的浏览器建立这个对象的不同方式写不同的代码
        var xmlHttpRequest;
        if (window.XMLHttpRequest) {
            //针对FireFox，Mozillar，Opera，Safari，IE7，IE8
            xmlHttpRequest = new XMLHttpRequest();
            //针对某些特定版本的mozillar浏览器的BUG进行修正
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            //针对IE6，IE5.5，IE5
            //两个可以用于创建XMLHTTPRequest对象的控件名称，保存在一个js的数组中
            //排在前面的版本较新
            var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < activexName.length; i++) {
                try {
                    //取出一个控件名进行创建，如果创建成功就终止循环
                    //如果创建失败，回抛出异常，然后可以继续循环，继续尝试创建
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    if (xmlHttpRequest) {
                        break;
                    }
                } catch (e) {}
            }
        }
        return xmlHttpRequest;
    }
    function getAjax(url, fn) {
        var xhr = createXMLHTTPRequest();
        if (xhr) {
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        fn(xhr.responseText);
                    } else {
                        //alert("error");
                    }
                }
            }
            xhr.send(null);
        }
    }