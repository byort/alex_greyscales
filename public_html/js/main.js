
/* global THREE, posx */
$(window).resize(function(){
    onWindowResize();
});

/*Handles window resizes. */
function onWindowResize(){
    
//    console.log(camera);
    
    var w = $(window).innerWidth();
    var h = $(window).innerHeight();
    /*For the ortho camera*/
    if (camera.hasOwnProperty("left")){
        camera.left = w / - camerascalar;
        camera.right = w  / camerascalar;
        camera.top = h / camerascalar;
        camera.bottom = h / - camerascalar;
    }
    /*For the perspective camera*/
    else if (camera.hasOwnProperty("apsect")){        
        camera.aspect = w/h;
    }
    
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
}

/***DETECTOR****/
if (!Detector.webgl) {
    
    var body = $('body');
    body.text("Sorry, your browser doesn't support WebGL!");
    body.append("<br><a href=\"http://get.webgl.org\"> Click here to get webGL poppin'</a>");
    body.css("text-align", "center");
    body.css("margin-top", "10%");
    body.css("font-size", "20px");
    
    $("#three-canvas").remove();
    $("#controls").remove();
}

var w = $(window).innerWidth();
var h = $(window).innerHeight();


/**********************************Necessary THREE.JS setup things*************************************/
/*Create the renderer, set its size and add it to the page*/
var renderer = new THREE.WebGLRenderer();
//var renderer2D = new THREE.CanvasRenderer();
renderer.setSize(w, h);

var canvas = $('#three-canvas');
//var canvas2D = $('2dcanvas');
canvas.append(renderer.domElement);
//canvas2D.append(renderer2D.domElement);

/*Create camera (orthographic means you DONT have FORESHORTENING)*/
var camerascalar = 175;
var camera = new THREE.OrthographicCamera( w / - camerascalar, w / camerascalar, h / camerascalar, h / - camerascalar, 1, 1000); //Frustrum lol

var fov = 100;

//var camera = new THREE.PerspectiveCamera(fov, w/h, 0.1, 1000);
camera.position.z = 7;
//camera.position.x = -5;

/*Create scene/stage*/
var scene = new THREE.Scene();

/*Create a light source*/
var light = new THREE.AmbientLight( new THREE.Color(1, 1, 1) );
scene.add(light);




/**********************WORKSPACE**************************/
makeTextures("img/greyscale", ['10.bmp','15.bmp','20.bmp']).then(function(texturearray){
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
    }).then(loadFont.bind( null ,"font/helvetiker_regular.typeface.json")).then(function(font){
        console.log('2',font);
        loadedFont = font;
        init();
    });

function init()
{
    globalproperties = {};
    maininit();
    resultsinit();
    testarrayinit();
    startup();
}
function maininit()
{
    globalproperties['main'] = {
        num: 0,
        repeat: 0,
        numRepeat: 5,
        baseLength: 4,
        barHeight: 1
    };
    globalproperties['positions'] = {
        top: {x:0, y:2},
        bot: {x:0, y:-2}
    };
    globalproperties['trialdata'] = {
        trialStartTime: 0,
        luminance: .5,
        condition: null,
    };
}
/*create background for experiment*/
function createSuperbackground()
{
    var geometry = new THREE.PlaneGeometry( w, h );
    var properties = {
        color: new THREE.Color(.5, .5, .5)
    };
    var material = new THREE.MeshBasicMaterial( properties ); 
    var background = new THREE.Mesh( geometry, material ); 
    background.position.x = 0;
    background.position.y = 0;
    background.position.z = -6;
    background.name = 'superbackground';
    scene.add( background ); 
}
createSuperbackground();

/*creates array for holding conditions*/
/*starting up experiment*/
function startup()
{
    createTestArray();    
//    midlineAxes();
//    var subject = prompt('participant');
//    changeglobal('subject', subject);
    createOutput(globallookup('data'),globallookup('headings'));
    createtrial();
}

function createtrial()
{
    var data = globallookup('data');
    var num = globallookup('num');
    var currdata = data[num];
    var positions = globallookup('positions');
    makeDisplay(currdata, positions);
    createOverlay(currdata, positions);
}

function makeDisplay(data, position)
{
    var texturearray = findtextures(data);
//    console.log(texturearray)
    var baselength = globallookup('baseLength');
    var imagescalar = data.length;
    var length = imagescalar*baselength;
    var top = createTexturePatch(length, texturearray, position.top);
    var bot = createTexturePatch(length, texturearray, position.bot);
    bot.rotation.z = Math.PI;
    scene.add(top,bot);
    changeglobal('trialStartTime', Date.now());
    wipetimer = setTimeout(screenwipe, 5000);
}

function createOverlay(data, position)
{
    var height = globallookup('barHeight');
    var baselength = globallookup('baseLength');
    var length = baselength * data.length;
    var num = Math.floor(length);
    var textoverlay = createTextArray(num, height);
    if(data.orientation === 1)
    {
        textoverlay.rotation.z += Math.PI;
    }
    textoverlay.position.y = position.top.y;
    textoverlay.position.x = position.top.x;
    scene.add(textoverlay.clone());
    textoverlay.position.y = position.bot.y;
    textoverlay.position.x = position.bot.x;
    scene.add(textoverlay.clone());
}

function createTextArray(num, height)
{
    var tempobj = new THREE.Object3D();
    for (var i=0; i<num; i++)
    {
        let text = createText("E", height*.8);
        text.position.y = -0.4*height;
        text.position.x = -num/2 + i + .1;
        tempobj.add(text);
    }
    tempobj.name = "wipe";
    return tempobj;
}

function createText(textstring, size)
{
    if(loadedFont === undefined )
    {
        console.log("font undefined");
        return ;
    }
    var parameters = {
        font: loadedFont, 
        size: size,
        height: .1,
    };
//    var shape = new THREE.FontUtils.generateShapes("Hello World", parameters);
//    var geometry = new THREE.ShapeGeometry(shape);
    var geometry = new THREE.TextGeometry(textstring, parameters);
    var properties = {
        color: new THREE.Color(.5,.5,.5),
        opacity: .5,
        transparent: true
    };
    var material = new THREE.MeshBasicMaterial(properties);
    var text = new THREE.Mesh(geometry, material);
    var tempobj = new THREE.Object3D();
    tempobj.add(text);
    return tempobj;
}
function midlineAxes()
{
    var length = w;
    var geometry = new THREE.PlaneGeometry(length, .05);
    var properties = {
        color: new THREE.Color(1,1,1)
    };
    var material = new THREE.MeshBasicMaterial(properties);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh.clone());
    mesh.rotation.z = Math.PI/2;
    scene.add(mesh.clone());
}


function findtextures(data)
{
    var obj = {};
    var name = String(data.length*10);
    for(let material of textures)
    {
        if(material.map.name === name)
        {
            obj = material;
        }
    }
    return obj;
}
/*running the experiment*/
function nextTrial()
{
    var test = globallookup('data');
    clearTimeout(wipetimer);
    recResults(test[globallookup('num' )], resultArray);
    screenwipe();
    var num = globallookup('num') ;
    num += 1;
    changeglobal('num', num);
//    console.log(globallookup('repeat'), globallookup('numRepeat'))
    if(globallookup('num')<test.length)
    {
        var timer = setTimeout(createtrial, 500, globallookup('num'));
    }
    else
    {
        changeglobal('num', 0);
        var repeat = globallookup('repeat');
        changeglobal('repeat', repeat+1);
        if(globallookup('repeat')<globallookup('numRepeat'))
        {
            var timer = setTimeout(createtrial, 500, globallookup('num'));
        }
        else
        {
            exit();
        }
    }
}
/*mouse and keyboard controls*/

document.onkeydown = function(key)
{
    if(curtime - globallookup('trialStartTime') > 500)
    {
        if(key.keyCode === 84)
        {
            changeglobal('trialStartTime', Date.now());
            resultArray = ['top'];
            nextTrial();
        }
        else if(key.keyCode === 66)
        {
            changeglobal('trialStartTime', Date.now());
            resultArray = ['bot'];
            nextTrial();
        }
    }
};

function exit()
{
    outputResponses();
//    window.location.reload();
}
function screenwipe()
{
    for(var i=scene.children.length-1; i>=0; i--)
    {
        if (scene.children[i].name === "wipe" || scene.children[i].name === "filter")
        {
            scene.remove(scene.children[i]);
        }
    }
    console.log(curtime - globallookup('trialStartTime'))
}


/************************END WORKSPACE************************/
var curtime;
function render() { 
    curtime = Date.now();
    
    requestAnimationFrame( render ); 
    renderer.render( scene, camera ); 

} 
render();
