// Send the blur task to the workers. Starts with setting up the needed data that each worker needs, then post a message to the worker with the data.

function sendBlurTask(worker, i, chunkWidth, isFirst, isLast, isIterationBlur, iteration) {
    const chunkHeight = image.height;
    const chunkStartX = i * chunkWidth;
    const chunkStartY = 0;
    const data = ctx.getImageData(chunkStartX, chunkStartY, chunkWidth, chunkHeight);
    const borderWidth = 1;
    // We need to make sure that each worker get the correct borders.
    const borderStartXleft = isFirst ? 0 : (i * chunkWidth) - 1;
    const imageBorderLeft = ctx.getImageData(borderStartXleft, chunkStartY, borderWidth, chunkHeight);
    const borderStartXright = isLast ? ((i + 1) * chunkWidth) - 1 : ((i + 1) * chunkWidth);
    const imageBorderRight = ctx.getImageData(borderStartXright, chunkStartY, borderWidth, chunkHeight);

    // Convert to arrayBuffers to send

    const imageDataBuf = data.data.buffer;
    const imageBorderLeftBuf = imageBorderLeft.data.buffer;
    const imageBorderRightBuf = imageBorderRight.data.buffer;


    worker.postMessage(
        {'type' : 'workerConstructor',
        'imageData' : imageDataBuf,
        'width' : chunkWidth,
        'height' : chunkHeight,
        'startX' : chunkStartX,
        'sizeImageData': imageDataBuf.byteLength
    }, [imageDataBuf]);
    // Sending the borders/edges to the worker
    worker.postMessage({'type' : 'newBorder',
        'imageBorderLeft' : imageBorderLeftBuf,
        'imageBorderRight' : imageBorderRightBuf,
        'iteration' : iteration
    }, [imageBorderLeftBuf, imageBorderRightBuf]);
}


