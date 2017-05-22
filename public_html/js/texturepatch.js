/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var textureMaterial;

function makeTextures(texturePath, patharray = undefined){
    return new Promise(function(resolve, reject){
        var loader = new THREE.TextureLoader();
        loader.crossOrigin = '';
        console.log("Loading ", texturePath, "with:",  loader);
        // load a resource
        var texturearray = [];
//        console.log(typeof patharray)
        if (typeof patharray === 'object')
        {
            for(let val of patharray)
            {
                let temppath = texturePath + val;
                let texture = loader.load(temppath);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.name = val.slice(0,3);
//                console.log(texture.name);
                texturearray.push(texture);
            }
        }
        else  
        {
            var texture  = loader.load(temppath);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.name = val.slice(0,2);
            texturearray.push(texture);
        }
        resolve(texturearray);

        },
        // Function called when download progresses
        function ( xhr ) {
            console.log( "Loading texture: " + (xhr.loaded / xhr.total * 100) + '%' );
        },
        // Function called when download errors
        function ( xhr ) {
            //console.log(xhr);
            console.log( 'The texture failed to load' , xhr );
            reject("An error occured while loading the texture");
        }
    );
}
       
function createTexturePatch(length, texture, position)
{
    var height = globallookup('barHeight');
    var material = texture;
    var geometry = new THREE.PlaneGeometry(length, height);
//    var height = material.map.image.height;
//    var width = material.map.image.width;
//    var geometry = new THREE.PlaneGeometry(1,1)
    var mesh = new THREE.Mesh(geometry, material);
//    mesh.scale.x = width;
//    mesh.scale.y = height;
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.name = "wipe";
    return mesh;
}