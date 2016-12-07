// The sequential blur implementation
function seqBlur() {

    // Set up variables that will be used, fethced from the image
    const data = ctx.getImageData(0, 0, image.width, image.height).data;
    const borderRetLeft = ctx.getImageData(0, 0, 1, image.height).data;
    const borderRetRight = ctx.getImageData(image.width - 1, 0, 1, image.height).data;
    imageData = {
        data,
        borderRetLeft,
        borderRetRight
    }
    // Iterate blur 30 times
    for(let i = 0; i < 30; i++) {
        imageData = boxBlur(imageData.data, image.width, image.height, imageData.imageBorderRetLeft, imageData.imageBorderRetRight);
    }

    // Put the blurred image onto the UI, using canvas. Need to first do some convertion
    const imageData2 = ctx.createImageData(image.width, image.height);
    for (let i = 0; i<imageData2.data.length; i++) {
        const val = imageData.data[i];
        if (val === null || val > 255 || val < 0) {
            log("illegal value: " + val + " at " + i);
            return;
        }
        imageData2.data[i] = val;
    }
    // Adds converted image
    ctx.putImageData(imageData2, 0, 0);
    end = Date.now();
    timeSpent = (end - begin) + " milliseconds";
    addBenchmark(timeSpent, 1);
}

