// The main thread message handler. Handles incoming messages from workers, and sends borders to the workers.

function messageHandler(e) {
    const messageType = e.data.type;
    switch (messageType) {
        // If we get a finished message from a worker, we update the UI
        case ("finished"):
            const imageData = ctx.createImageData(e.data.width, e.data.height);
            var typed_array = new Uint8ClampedArray(e.data.imageData,0, e.data.sizeImageData);
            imageData.data.set(typed_array);
            /*for (let i = 0; i<imageData.data.length; i++) {
                const val = e.data.imageData[i];
                imageData.data[i] = val;
            }
            */
            ctx.putImageData(imageData, e.data.startX, 0);
            workersFinished++;
            if(workersFinished === workers.length) {
                end = Date.now();
                timeSpent = (end - begin) + " milliseconds";
                terminateWorkers();
                addBenchmark(timeSpent, workers.length);
                workersFinished = 0;
            }
            break;
            // Every iteration, the workers send partial results. In order to synchronize the workers, and not let one of the workers get ahead
            // we need to store the incoming borders, and when we got all the borders, we distribute them out to each worker and let them
            // start on the next iteration
        case ("partialResult"):
            partialResultCounter++;

            if(e.target.index === 0) {
                borderArray[e.target.index].imageBorderLeft = e.data.imageBorderLeft;
                borderArray[e.target.index+1].imageBorderLeft = e.data.imageBorderRight;
            } else if(e.target.index === workers.length-1) {
                borderArray[e.target.index].imageBorderRight = e.data.imageBorderRight;
                borderArray[e.target.index-1].imageBorderRight = e.data.imageBorderLeft;
            } else {
                borderArray[e.target.index-1].imageBorderRight = e.data.imageBorderLeft;
                borderArray[e.target.index+1].imageBorderLeft = e.data.imageBorderRight;
            }

            if(partialResultCounter === workers.length) {
                borderArray.map((border) => border.iteration = e.data.iteration + 1);
                borderArray.map((border) => border.type = "newBorder");
                for(let i = 0; i < borderArray.length; i++ ) {
                    workers[i].postMessage(borderArray[i]);
                }
                partialResultCounter = 0;
            }

        default:
            break;
    }
}
