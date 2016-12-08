// The message handler on the worker.
// WorkerConstructor messge sets up the workers variables, and the segment of the image is loaded

importScripts("blur.js");

self.imageData;
self.startX;
self.width;
self.height;

function messageHandler(e) {
    const messageType = e.data.type;
    switch (messageType) {
        case ("workerConstructor"):
            workerConstructor(e);
            break;
        // When a new border arrives, the worker will blur one iteration, and then if it is the last iteration send back the finished image
        // It it is a iteration in the middle, it will send its new blurred borders, so that the segments next to it will have updated borders.
        case ("newBorder"):
            newBorder(e);
    }
}
addEventListener("message", messageHandler, true);

function workerConstructor(e) {
    this.sizeImageData = e.data.sizeImageData;
    var typed_array = new Uint8ClampedArray(e.data.imageData,0, this.sizeImageData);
    this.imageData = typed_array;
    this.startX = e.data.startX;
    this.width = e.data.width;
    this.height = e.data.height;
}

function newBorder(e) {
    var imageBorderLeft = new Uint8ClampedArray(e.data.imageBorderLeft,0, this.height*4);
    var imageBorderRight = new Uint8ClampedArray(e.data.imageBorderRight,0, this.height*4);

    const returnVal = boxBlur(this.imageData, this.width, this.height, imageBorderLeft, imageBorderRight);
    this.imageData = returnVal.data;
    const borderLeft = returnVal.borderRetLeft;
    const borderRight = returnVal.borderRetRight;

    // Convert to arraybuffers
    var borderLeftBuf = new Uint8ClampedArray(borderLeft,0, this.height*4).buffer;
    var borderRightBuf = new Uint8ClampedArray(borderRight,0, this.height*4).buffer;

    if(e.data.iteration === 30) {
        var imageData= new Uint8ClampedArray(this.imageData,0, this.sizeImageData).buffer;
        postMessage({
            "type": "finished",
            "imageData": imageData,
            "width": this.width,
            "height": this.height,
            "startX": this.startX,
            "iteration": e.data.iteration,
            "sizeImageData": this.sizeImageData
        }, [imageData]);
    } else {
        postMessage({
            "type": "partialResult",
            "iteration": e.data.iteration,
            'imageBorderRight': borderRightBuf,
            'imageBorderLeft': borderLeftBuf
        }, [borderLeftBuf, borderRightBuf]);
    }
}