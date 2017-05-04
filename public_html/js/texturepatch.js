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
        if (typeof patharray === 'object')
        {
            for(let val of patharray)
            {
                let temppath = texturePath + val;
                let texture = loader.load(temppath);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.name = val.slice(0,2);
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
makeTextures("img/greyscale", ['1a.jpg', '1b.jpg','2a.jpg','2b.jpg','3a.jpg','3b.jpg']).then(function(texturearray){
    var materialarray = [];
    for(let val of texturearray)
    {
        var imageMaterial = new THREE.MeshBasicMaterial({
            map: val,
            color: new THREE.Color(1,1,1)
        });
        materialarray.push(imageMaterial);
    }
    //Now do something with the texture mapped mesh
    textures = materialarray;
    init();
            });
       
function createTexturePatch(length, texture, position)
{
    
    var material = texture;
    var geometry = new THREE.PlaneGeometry(length, 1);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.name = "wipe";
    return mesh;
}