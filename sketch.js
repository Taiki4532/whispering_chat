var capture;
var w = 640;
var h = 480;

let button;
let buttonText;
let anoFaceMode;

function setup() {

  capture = createCapture({
    audio: ture,
    video: false
  });
  capture.elt.setAttribute('autoplay','playsinline', '');

  createCanvas(1280,1024);
  capture.size(w, h);
  capture.hide();

}
 
function draw() {
  image(capture, 0, 0, w, h);
 

}