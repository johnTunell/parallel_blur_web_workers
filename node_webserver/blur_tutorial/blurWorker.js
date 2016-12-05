/**
 * Created by nottan on 2016-11-29.
 */
importScripts("blur.js");

self.imageData = [];
self.storedOnWorker = 1;
self.startX;

function messageHandler(e) {
    var messageType = e.data.type;
    switch (messageType) {
        case ("blur"):
            this.imageData = e.data.imageData;
            this.startX = e.data.startX;
            break;
        case ("border"):
            var returnVal = boxBlur(this.imageData, e.data.width, e.data.height, e.data.imageBorderLeft,  e.data.imageBorderRight, e.data.isFirst, e.data.isIteration);
            this.imageData = returnVal.data;
            var borderLeft = returnVal.borderRetLeft;
            var borderRight = returnVal.borderRetRight;
            this.storedOnWorker++;

            if(e.data.iteration === 30) {
                postMessage({
                    "type": "progress",
                    "imageData": this.imageData,
                    "width": e.data.width,
                    "height": e.data.height,
                    "startX": this.startX,
                    "isFirst": e.data.isFirst,
                    "isLast": e.data.isLast,
                    'isIteration': e.data.isIteration,
                    "iteration": e.data.iteration
                });
            } else {
                postMessage({
                    "type": "borderDone",
                    "isFirst": e.data.isFirst,
                    "startX": e.data.startX,
                    "isLast": e.data.isLast,
                    'isIteration': e.data.isIteration,
                    "iteration": e.data.iteration,
                    'imageBorderRight': borderRight,
                    'imageBorderLeft': borderLeft
                });
            }
    }
}

    addEventListener("message", messageHandler, true);