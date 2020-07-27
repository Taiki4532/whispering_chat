let localStream = null;
let peer = null;
let peerId;
var idList = [];
let constraints = {
  video:true,
  audio:true
};
    // カメラ映像取得
    navigator.mediaDevices.getUserMedia(constraints)
      .then( stream => {
      localStream = stream;
    }).catch( error => {
      // 失敗時にはエラーログを出力
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    });

    peer = new Peer({
    key: 'db12c4f5-2b65-411c-8e39-cd36386150cf',
    debug: 3
    });

  peer.on('open', () => {
    peerId = peer.id;
  });

function callOthers(){
    const theirID = IDinput.value;
    var options = { 'constraints' : {
      'mandatory' : {
      'offerToReceiveAudio' : true,
      'offerToReceiveVideo' : false
      }
    }
  }
    const mediaConnection = peer.call(theirID, localStream
    );
    setEventListener(mediaConnection);
  };

//   document.getElementById("make-call").onclick = () => {
//   const theirID = document.getElementById('their-id').value;
//   var options = { 'constraints' : {
//     'mandatory' : {
//     'offerToReceiveAudio' : true,
//     'offerToReceiveVideo' : false
//     }
//   }
// }
//   const mediaConnection = peer.call(theirID, localStream
//   );
//   setEventListener(mediaConnection);
// };

// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    const videoElm = document.getElementById('their-video');
    videoElm.srcObject = stream;
    videoElm.play();
  });
}
//着信処理
peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream);
  setEventListener(mediaConnection);
});

var capture;
var w = 640;
var h = 512;
var IDinput;
var myId;
var startButton;

let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/UQrFu3ScX/model.json';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();

  IDinput = createInput();
  IDinput.position(width*5/8,height*21/32);

  myId = createInput();
  myId.position(width*5/8,height/2);


  startButton = createButton('Start');
  startButton.position(width*5/8,height*7/8)
  startButton.mousePressed(callOthers);
}

function draw() { 
  background(20);
  textFont('Open Sans');
  fill(255);
  textSize(80);
  textAlign(CENTER,TOP);
  text("👄 whispering chat 👂",width/2,height/16);

  textFont('Open Sans');
  fill(255);
  textSize(40);
  textAlign(CENTER,TOP);
  text("はじめかた",width/2,height/4);

  fill(255);
  textSize(30);
  textAlign(LEFT,TOP);
  text("①自分のIDを確認　→",width/8,height/2);
  
  myId = peerId;

  text("②通信相手とIDを交換して\n　テキストボックスに記入　→",width/8,height*5/8);

  text("②ボタンを押して通話開始　→",width/8,height*7/8);

  // Draw the video
  //image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);

  /*
  if(label == "whispering"){
    localStream.getAudioTracks()[0].enabled = true;
    let video = document.getElementById('their-video');
    video.muted = true;
  }else if(label == "Listening"){
    let video = document.getElementById('their-video');
    video.muted = false;
    localStream.getAudioTracks()[0].enabled = false;
  }else if(label == "None"){
    localStream.getAudioTracks()[0].enabled = false;
    let video = document.getElementById('their-video');
    video.muted = true;
  }
  */
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}