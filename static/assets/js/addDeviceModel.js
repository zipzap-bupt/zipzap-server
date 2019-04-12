
class AddModel{
    constructor(){
    }

    addaModel (url,position,scale,rotation,name,deviceId,label){
        var loader = new THREE.STLLoader();
        //loader.load("static/gis_815/models/somedevices/" + url, function(geometry) {
        loader.load( url, function(geometry) {
            var material = new THREE.MeshPhongMaterial({
                color: 0xFF0000,
                specular: 0x111111,
                shininess: 200
            });
            var mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.set(position.x,position.y,position.z);
            mesh.rotation.set(rotation.x,rotation.y,rotation.z);
            mesh.scale.set(scale.x,scale.y,scale.z);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            mesh.deviceName = name;
            mesh.deviceId = deviceId;    //真实设备Id
            mesh.label = label;

            scene.add(mesh);
            objects.push(mesh);
            //console.log(objects)
        });
    }

    addAllModel (siteId){
        var allModel = [];
        $.ajax({
            url:'/api/dModel/getSitedModel/'+siteId,
            type:'GET',
            async:false,
            success: function(res){
                allModel = res.dModels;
            },
            error: function(e){
                $.alert("场景模型添加失败！可能是数据库问题"+e.message);
            }
        });

        objects = [];

        allModel.forEach(element => {
            var name = element.name;
            var label = element.label;
            var deviceId = element.deviceId;
            var location = JSON.parse(element.location);
            var position = location.position;
            var scale = location.scale;
            var rotation = location.rotation;
            
            this.addaModel(element.deviceModelUrl,position,scale,rotation,name,deviceId,label);
            
        });
    }

}

