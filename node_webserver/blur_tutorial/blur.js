/**
 * Created by nottan on 2016-11-29.
 */
function inRange(i, width, height) {
    return ((i>=0) && (i < width*height*4));
}
function averageNeighbors(imageData, width, height, i, rightBorder, leftBorder, imageBorder) {
    var v = imageData[i];
    let firstRow = 0;
    let lastRow = height-1;
    let currentRow = Math.floor(i/height/2);
// cardinal directions
    var north = inRange(i-width*4, width, height) ? imageData[i-width*4] : v;
    var south = inRange(i+width*4, width, height) ? imageData[i+width*4] : v;
    var west = inRange(i-4, width, height) ? imageData[i-4] : v;
    var east = inRange(i+4, width, height) ? imageData[i+4] : v;
// diagonal neighbors
    var ne = inRange(i-width*4+4, width, height) ? imageData[i-width*4+4] : v;
    var nw = inRange(i-width*4-4, width, height) ? imageData[i-width*4-4] : v;
    var se = inRange(i+width*4+4, width, height) ? imageData[i+width*4+4] : v;
    var sw = inRange(i+width*4-4, width, height) ? imageData[i+width*4-4] : v;
// average
    var newVal = Math.floor((north + south + east + west + se + sw + ne + nw + v)/9);
    if (isNaN(newVal)) {
        sendStatus("bad value " + i + " for height " + height);
        throw new Error("NaN");
    }

    if(rightBorder) {
        // MIGHT NEED TO CHANGE 2 to number of threads!
        // NEED TO TAKE east, se, ne from a border array!
        // Calculate what row.

       /* if(currentRow === firstRow) {
            ne = v;
            east = imageBorder[0];
            se = imageBorder[4];
        } else if (currentRow === lastRow) {
            ne = imageBorder[currentRow*4-1];
            east = imageBorder[currentRow*400];
            se = v;
        } else {
            ne = imageBorder[currentRow*400];
            east = imageBorder[currentRow*400+1];
            se = imageBorder[currentRow*400+2];
        }
*/
       i = i +4;
       let rest = i % width;
       east = imageBorder[(currentRow*4)+rest];
       if(currentRow !== lastRow) {
           se = imageBorder[(currentRow*4)+rest+4];
       }

       if(currentRow === lastRow) {
           console.log('at last row');
       }

       if(currentRow !== firstRow ) {
           ne = imageBorder[(currentRow*4)+rest-4];
       }
       //console.log(i-width*4);
       //console.log(rest);


        newVal = Math.floor((north + south + west + sw + nw + east + se + ne + v)/9);
        //newVal = Math.floor((north + south + west + sw + nw + v)/6);
        // newVal = Math.floor((north + south + v)/3);
    }

    if(leftBorder ) {

        //currentRow = currentRow + 1;
        // i = i + 4;
        let rest = i % width;
        west = imageBorder[(currentRow*4)+rest];
        if(currentRow !== lastRow) {
            sw = imageBorder[(currentRow*4)+rest+4];
        }

        if(currentRow === lastRow) {
            console.log('at last row');
        }

        if(currentRow !== firstRow ) {
            nw = imageBorder[(currentRow*4)+rest-4];
        }
        //console.log(i-width*4);
        //console.log(rest);

        //var newVal = Math.floor((north + south + west + sw + nw + ne + east + se + v)/9);
        // NEED TO TAKE west, sw, nw from a border array!
        /*if(currentRow === firstRow) {
            ne = v;
            east = imageBorder[0];
            se = imageBorder[1];
        } else if (currentRow === lastRow) {
            ne = imageBorder[currentRow*4-1];
            east = imageBorder[currentRow*400];
            se = v;
        } else {
            ne = imageBorder[currentRow*400];
            east = imageBorder[currentRow*400+1];
            se = imageBorder[currentRow*400+2];
        }
*/
        newVal = Math.floor((north + south + west + sw + nw + ne + east + se + v)/9);
        //newVal = Math.floor((north + south + east + se + ne + v)/6);
      //   newVal = Math.floor((north + south +v)/3);
    }
    return newVal;
}
function boxBlur(imageData, width, height, imageBorderLeft, imageBorderRight, isFirst) {
    var data = [];
    var val = 0;

    for (var i = 0; i < width * height * 4; i++) {
        val = averageNeighbors(imageData, width, height, i);
        // At a border!
        if ((i + 4) % (width * 4) < 8) {
            if ((i + 4) % (width * 4) < 4) {
                //console.log(imageBorderLeft);
                // We are approaching the right border
                if(imageBorderRight[0] !== 0) {
                    val = averageNeighbors(imageData, width, height, i, true, false, imageBorderRight);
                }
            } else { // We are approaching the left border!
                //console.log(imageBorderRight);
                if(imageBorderLeft[0] !== 0) {
                    val = averageNeighbors(imageData, width, height, i, false, true, imageBorderLeft);
                }
            }
        }
        data[i] = val;
    }
    return data;
}



// At right border
/*   if ((width * 4) % i === 4 && i !== 0 && i < width*height*4) {
        for (var j = 0; j < 5; j++) {
            val = averageNeighbors(imageData, width, height, i + j, true, false, imageBorderRight);
        }
    }

    // Left border
    if (i % ((width * 4) + 4) === 4 && i !== 0 && i < (width*height*4-4) ) {
        for (var j = 0; j < 5; j++) {
            val = averageNeighbors(imageData, width, height, i + j, false, true, imageBorderLeft);
        }
    }
    */