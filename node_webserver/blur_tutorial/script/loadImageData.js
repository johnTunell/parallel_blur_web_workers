// Just some code to load the image into a canvas element, in order to work with it

function loadImageData(url) {
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        image = new Image();
        image.src = url;
        document.getElementById("imageContainer").appendChild(canvas);
        image.onload = function(){
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            window.imgdata = ctx.getImageData(0, 0, image.width, image.height);
            n = ctx.createImageData(image.width, image.height);
        };
    }

// Add event listeners to buttons.
function loadDemo() {
    if (typeof(Worker) !== "undefined") {
        document.getElementById("status").innerHTML = "Your browser supports HTML5 WebWorkers";
        document.getElementById('iterationBlurButton').addEventListener('click', () => {
            begin = Date.now();
            console.time('BlurTimer');
            startBlur(true, 1);
        });
        document.getElementById('reloadImage').addEventListener('click', () => {
            var image = document.getElementsByTagName("canvas")[1];
            document.getElementById("imageContainer").removeChild(image);
            loadImageData(imageURL);
        });
        loadImageData(imageURL);
        document.getElementById("iterationBlurButton").disabled = false;
    }
}
window.addEventListener("load", loadDemo, true);


