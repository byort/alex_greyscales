var loadedFont;
function loadFont(filepath)
{
    return new Promise(function(resolve, reject){
        var loader = new THREE.FontLoader();
        console.log("Loading ", filepath, "with:",  loader);
        var font = loader.load(filepath, function (font)
        {
            resolve(font);
        });
        },
        // Function called when download progresses
        function ( xhr ) {
            console.log( "Loading font: " + (xhr.loaded / xhr.total * 100) + '%' );
        },
        // Function called when download errors
        function ( xhr ) {
            //console.log(xhr);
            console.log( 'The font failed to load' , xhr );
            reject("An error occured while loading the font");
        }
    );
}


