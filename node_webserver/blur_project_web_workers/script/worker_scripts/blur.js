function inRange(i, width, height) {
    return ((i>=0) && (i < width*height*4));
}

// Algorithm to find the average of a pixel, determined by it's neighbours
function averageNeighbors(imageData, width, height, i, rightBorder, leftBorder, imageBorder) {
    // Gaussian constant used
    const gausConst = {
        corner: 0.0947416,
        neighbour: 0.118318,
        center: 0.147761
    }
    const v = imageData[i];
    let firstRow = 0;
    let lastRow = height-1;
    let currentRow = Math.floor(i/width/4);
    // Check in all directions if there is a valid value, if not (that is, it is at an edge), it will use the pixels own value
// cardinal directions
    const north = inRange(i - width * 4, width, height) ? imageData[i - width * 4] : v;
    const south = inRange(i + width * 4, width, height) ? imageData[i + width * 4] : v;
    let west = inRange(i - 4, width, height) ? imageData[i - 4] : v;
    let east = inRange(i + 4, width, height) ? imageData[i + 4] : v;
// diagonal neighbors
    let ne = inRange(i - width * 4 + 4, width, height) ? imageData[i - width * 4 + 4] : v;
    let nw = inRange(i - width * 4 - 4, width, height) ? imageData[i - width * 4 - 4] : v;
    let se = inRange(i + width * 4 + 4, width, height) ? imageData[i + width * 4 + 4] : v;
    let sw = inRange(i + width * 4 - 4, width, height) ? imageData[i + width * 4 - 4] : v;
// average
    let newVal = Math.floor((north * gausConst.neighbour + south * gausConst.neighbour + east * gausConst.neighbour + west * gausConst.neighbour + se * gausConst.corner + sw * gausConst.corner + ne * gausConst.corner + nw * gausConst.corner + v * gausConst.center));

    // If we are at a right border, we want to grab pixels from the "border Array"
    if(rightBorder) {
       i = i +4;
       let rest = i % width;
       east = imageBorder[(currentRow*4)+rest];
       if(currentRow !== lastRow) {
           se = imageBorder[(currentRow*4)+rest+4];
       }
       if(currentRow !== firstRow ) {
           ne = imageBorder[(currentRow*4)+rest-4];
       }
        newVal = Math.floor((north*gausConst.neighbour+ south*gausConst.neighbour+ east*gausConst.neighbour+ west*gausConst.neighbour+ se*gausConst.corner + sw*gausConst.corner + ne*gausConst.corner + nw*gausConst.corner + v*gausConst.center));
    }

    // If we are at a left border, we want to grab pixels from the "border Array"
    if(leftBorder ) {
        let rest = i % width;
        west = imageBorder[(currentRow*4)+rest];
        if(currentRow !== lastRow) {
            sw = imageBorder[(currentRow*4)+rest+4];
        }
        if(currentRow !== firstRow ) {
            nw = imageBorder[(currentRow*4)+rest-4];
        }
        newVal = Math.floor((north*gausConst.neighbour+ south*gausConst.neighbour+ east*gausConst.neighbour+ west*gausConst.neighbour+ se*gausConst.corner + sw*gausConst.corner + ne*gausConst.corner + nw*gausConst.corner + v*gausConst.center));
    }
    return newVal;
}

// Takes in a image, a left and right border, and blurs the image and both the borders for one iteration
function boxBlur(imageData, width, height, imageBorderLeft, imageBorderRight) {
    const returnVal = {
        data: [],
        borderRetRight: [],
        borderRetLeft: []
    };

    let val = 0;
    for (let i = 0; i < width * height * 4; i++) {
        // Because we are working with RGBA, the Alpha will always be 255, so unnecessary to manipulate this pixel.
        // The alpha is every fourth position in the data array
        if (i % 4 !== 3) {

            val = averageNeighbors(imageData, width, height, i);
            // At a border!
            if ((i + 4) % (width * 4) < 8) {
                if ((i + 4) % (width * 4) < 4) {
                    // We are approaching the right border
                    if (imageBorderRight !== undefined && imageBorderRight[0] !== 0) {
                        val = averageNeighbors(imageData, width, height, i, true, false, imageBorderRight);
                        returnVal.borderRetRight.push(val);
                    }
                } else { // We are approaching the left border!
                    if (imageBorderLeft !== undefined && imageBorderLeft[0] !== 0) {
                        val = averageNeighbors(imageData, width, height, i, false, true, imageBorderLeft);
                        returnVal.borderRetLeft.push(val);
                    }
                }
            }
        } else {
            val = 255;
            if ((i + 4) % (width * 4) < 8) {
                if ((i + 4) % (width * 4) < 4) {
                    returnVal.borderRetRight.push(val);
                } else {
                    returnVal.borderRetLeft.push(val);
                }
            }
        }
        returnVal.data[i] = val;
    }
    return returnVal;
}

