// The message handler on the worker.
// WorkerConstructor messge sets up the workers variables, and the segment of the image is loaded

importScripts("blur.js");

self.imageData = [];
self.startX;
self.width;
self.height;

function messageHandler(e) {
    const messageType = e.data.type;
    switch (messageType) {
        case ("workerConstructor"):
            this.imageData = e.data.imageData;
            this.startX = e.data.startX;
            this.width = e.data.width;
            this.height = e.data.height;
            break;
        // When a new border arrives, the worker will blur one iteration, and then if it is the last iteration send back the finished image
        // It it is a iteration in the middle, it will send its new blurred borders, so that the segments next to it will have updated borders.
        case ("newBorder"):
            const returnVal = boxBlur(this.imageData, this.width, this.height, e.data.imageBorderLeft, e.data.imageBorderRight);
            this.imageData = returnVal.data;
            const borderLeft = returnVal.borderRetLeft;
            const borderRight = returnVal.borderRetRight;

                if(e.data.iteration === 30) {
                    postMessage({
                        "type": "finished",
                        "imageData": this.imageData,
                        "width": this.width,
                        "height": this.height,
                        "startX": this.startX,
                        "iteration": e.data.iteration
                    });
                } else {
                    postMessage({
                        "type": "partialResult",
                        "iteration": e.data.iteration,
                        'imageBorderRight': borderRight,
                        'imageBorderLeft': borderLeft
                    });
            }
    }
}
addEventListener("message", messageHandler, true);