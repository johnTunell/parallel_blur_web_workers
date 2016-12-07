// A simple ball animation

let context;
let dx = 2;
let dy = 2;
let y = 150;
let x = 30;

setInterval(draw,6);

function draw(){
    context= myCanvas.getContext('2d');
    context.clearRect(0,0,300,300);
    context.beginPath();
    context.fillStyle="#0000ff";
    context.arc(x,y,20,0,Math.PI*2,true);
    context.closePath();
    context.fill();
    if( x<20 || x>280)
        dx=-dx;
    if( y<20 || y>280)
        dy=-dy;
    x+=dx;
    y+=dy;
}
