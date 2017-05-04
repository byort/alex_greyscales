
var imageSequence = [];
var imgNo = 1;
/** 

1. captureCanvasFramesAndProcess() //Call this until you have sufficient iamges (ie. determine a cut off point, time, frames, press a button.....)
2. processImageSequence()
*/

/*Called like captureCanvasFramesAndProcess(renderer.domElement);*/
function captureCanvasFramesAndProcess(canvas){
//    console.log(1);
    copyCanvasFrame(canvas); //always png by default
}

function copyCanvasFrame(canvas){
    var buffer = document.createElement('canvas');
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    
    buffer.getContext('2d').drawImage(canvas,0,0);
    downloadBufferImages(buffer.toDataURL());
    
}


/** CALL WHEN FINISHED - returns images*/
function processImageSequence(imageSequence){
//    console.log("rPIS");
    /*After storing all the frames, put them in the cut*/
    var imagesFromBuffer = [];                
    for (var i = 0; i < imageSequence.length; i++){
        imagesFromBuffer.push(imageSequence[i].toDataURL());
    }
    
    // console.log("Frames captured, sending to server");
    
    return imagesFromBuffer;
}

function downloadBufferImages(buffer){
    if(imgNo<10)
    {
        u = "00"+String(imgNo)
    }
    else if (imgNo<100)
    {
        u = "0"+String(imgNo)
    }
    else
    {
        u = String(imgNo)
    }
//    console.log(u)
    downloadData("image"+u+".png", buffer);
    imgNo+=1;
//    console.log(imgNo)
}


function downloadData(filename, data){
      ////http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction
        var a = document.createElement('a');
        a.href = data;
        a.target = '_blank';
        a.download = filename;
        a.innerHTML = "<h4>Click to download data!</h4> <p>(if they didn't download already)</p>";

        a.className += " results-download";

        document.body.appendChild(a);

        a.click();
}