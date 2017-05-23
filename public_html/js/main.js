
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
function setStyle()
{
    var e = document.getElementById('gobar');
    var f = document.getElementById('splashscreen');
    e.style.display = "none";
    f.style.display = "block";
}

function init()
{
    globalproperties = {};
    maininit();
    resultsinit();
    testarrayinit();
    setStyle();
    var patharray = createPatharray();
    var patharray2 = createPatharray2();
    makeTextures("img/greyscale", patharray).then(function(texturearray){
        var materialarray = [];
        for(let val of texturearray)
        {
            var imageMaterial = new THREE.MeshBasicMaterial({
                map: val,
                color: new THREE.Color(1,1,1)
            });
            imageMaterial.name = val.name;
            materialarray.push(imageMaterial);
        }
        //Now do something with the texture mapped mesh
        textures = materialarray;
        }).then(makeTextures.bind( null, "img/greyscale", patharray2)).then(function(texturearray){
        for(let val of texturearray)
        {
            var imageMaterial = new THREE.MeshBasicMaterial({
                map: val,
                color: new THREE.Color(1,1,1)
            });
            imageMaterial.name = val.name;
            textures.push(imageMaterial);
        }    
        }).then(loadFont.bind( null ,"font/Allstar_Regular.json")).then(function(font){
            console.log('2',font);
            loadedFont = font;
            changeglobal('splash',false);
            toggleVisibility('gobar');
    });
}
init();
function maininit()
{
    globalproperties['main'] = {
        num: 0,
        repeat: 0,
        numRepeat: 2,
        baseLength: 4,
        barHeight: 1,
        alphaString: 'abcdefghijklmnopqrstuvwxyz',
        splash:true,
        run:false,
    };
    globalproperties['positions'] = {
        top: {x:0, y:2},
        bot: {x:0, y:-2}
    };
    globalproperties['trialdata'] = {
        luminance: .5,
        condition: null,
        whereleft: null,
        whereluminance: null,
    };
    globalproperties['trialtimer']={
        trialStartTime: 0,
        minTime: 3000,
        maxTime: 5000,
    };
}
/* creates patharrays for loading textures*/
function createPatharray()
{
    var alphaString = 'abcdefghijklmnopqrstuvwxyz';
    var numVariations = 10;
    var filetype = '.bmp';
    var multiplier = ['10','15','20'];
    var patharray = [];
    for(let idx of multiplier)
    {
        for(let i=0; i<numVariations; i++)
        {
            let variation = alphaString[i];
            var tempstring = idx + variation + filetype;         
            patharray.push(tempstring);
        }
    }
    return patharray;
}

function createPatharray2()
{
    var alphaString = 'abcdefghijklmnopqrstuvwxyz';
    var numVariations = 5;
    var filetype = '.bmp';
    var multiplier = ['10','15','20'];
    var luminance = ['dark', 'light'];
    var patharray = [];
    for (let ligs of luminance)
    {
        for(let idx of multiplier)
        {
            for(let i=0; i<numVariations; i++)
            {
                let variation = alphaString[i];
                var tempstring = idx + variation + ligs + filetype;         
                patharray.push(tempstring);
            }
        }
    }
    return patharray;
}

/*create background for experiment*/
function createSuperbackground()
{
    var geometry = new THREE.PlaneGeometry( w, h );
    var val = .5;
    var properties = {
        color: new THREE.Color(val, val, val)
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
    if (data.control !== 0)
    {
        var texture2 = findtextures(data, data.control);
//        console.log(texture2);
    }
//    console.log(texturearray)
    var baselength = globallookup('baseLength');
    var imagescalar = data.length;
    var length = imagescalar*baselength;
    var timer = globallookup('trialtimer');
    var trialtimer = Math.floor(Math.random()*(timer.maxTime - timer.minTime))+timer.minTime;
    var allocatePositions = whereisleft();
    var allocateleftluminance = data.control !== 0?whereisleft():null;
    changeglobal('whereluminance', allocateleftluminance);
    changeglobal('whereleft', allocatePositions);
    if (allocatePositions === 0)
    {
        var leftdark = allocateleftluminance === 1?createTexturePatch(length, texture2, position.top):createTexturePatch(length, texturearray, position.top);
        var rightdark = allocateleftluminance === 0?createTexturePatch(length, texture2, position.bot):createTexturePatch(length, texturearray, position.bot);
    }
    else if (allocatePositions === 1)
    {
        var leftdark = allocateleftluminance === 1?createTexturePatch(length, texture2, position.bot):createTexturePatch(length, texturearray, position.bot);
        var rightdark =  allocateleftluminance === 0?createTexturePatch(length, texture2, position.top):createTexturePatch(length, texturearray, position.top);
    }
    rightdark.rotation.z = Math.PI;
    scene.add(leftdark,rightdark);
    changeglobal('trialStartTime', Date.now());
    wipetimer = setTimeout(screenwipe, trialtimer);
}

function whereisleft()
{
    var rand = Math.random();
    if(rand < .5)
    {
        return 0; //top
    }
    else 
    {
        return 1; //bottom
    }
    
}

function createOverlay(data, position)
{
    var height = globallookup('barHeight');
    var baselength = globallookup('baseLength');
    var length = baselength * data.length;
    var num = Math.floor(length);
    var textoverlay = createTextArray(data.letter, num, height);
    if(data.orientation === 1)
    {
        textoverlay.rotation.y += Math.PI;
    }
    textoverlay.position.y = position.top.y;
    textoverlay.position.x = position.top.x;
    textoverlay.position.z = 1;
    scene.add(textoverlay.clone());
    textoverlay.position.y = position.bot.y;
    textoverlay.position.x = position.bot.x;
    scene.add(textoverlay.clone());
}

function createTextArray(letter, num, height)
{
    var tempobj = new THREE.Object3D();
    for (var i=0; i<num; i++)
    {
        let text = createText(letter, height*.8);
        text.position.y = -0.35*height;
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
        height: 5
    };
//    var shape = new THREE.FontUtils.generateShapes("Hello World", parameters);
//    var geometry = new THREE.ShapeGeometry(shape);
    var geometry = new THREE.TextGeometry(textstring, parameters);
    var properties = {
        color: new THREE.Color(.5,.5,.5),
//        wireframe: true,
//        opacity: .5,
//        transparent: true
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


function findtextures(data, luminance = undefined)
{
    var obj = {};
    if (luminance !== undefined)
    {
        var lig = luminance === 1? "light": "dark";
        var variation = pickvar(5);
    }
    else
    {
        var variation = pickvar(10);
        var lig = "";
    }
    var name = String(data.length*10)+variation+lig;
//    console.log(name);
    for(let material of textures)
    {
        if(material.map.name === name)
        {
            obj = material;
        }
    }
    return obj;
}
function pickvar(n)
{
    var alphastring = 'abcdefghijklmnopqrstuvwxyz';
    var numVariations = n;
    var pick = Math.floor(Math.random()*numVariations);
    return alphastring[pick];
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
    if(globallookup('run') === false && key.keyCode === 32)
    {
        changeglobal('run', true);
        toggleVisibility('gobar');
        toggleVisibility('splashscreen');
        startup();
    }
    else if(curtime - globallookup('trialStartTime') > 500 && globallookup('run'))
    {
        let whereleft = globallookup('whereleft');
        let whereluminance = globallookup('whereluminance')===0?"right":"left";
        var leftdark = whereleft === 0?"top":"bot";
        if(key.keyCode === 84)
        {
            changeglobal('trialStartTime', Date.now());
            resultArray = ['top', leftdark, whereluminance];
            nextTrial();
        }
        else if(key.keyCode === 66)
        {
            changeglobal('trialStartTime', Date.now());
            resultArray = ['bot', leftdark, whereluminance];
            nextTrial();
        }
    }
    
};

function toggleVisibility(id)
{
    console.log('toggleing: ' + id )
    var e = document.getElementById(id);
    e.style.display = e.style.display !== "block"?"block":"none";
}

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
    console.log('wiping', curtime - globallookup('trialStartTime'))
}


/************************END WORKSPACE************************/
var curtime;
function render() { 
    curtime = Date.now();
    
    requestAnimationFrame( render ); 
    renderer.render( scene, camera ); 
    
} 
render();
