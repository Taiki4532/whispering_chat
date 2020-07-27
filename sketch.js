let localStream = null;
let peer = null;
var idList = [];
let constraints = {
  video:true,
  audio:true
};
    // カメラ映像取得
    navigator.mediaDevices.getUserMedia(constraints)
      .then( stream => {
      // 成功時にvideo要素にカメラ映像をセットし、再生
      // const videoElm = document.getElementById('my-video')
      // videoElm.srcObject = stream;
      // videoElm.play();
      // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
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
    document.getElementById('my-id').textContent = peer.id;
  });

  document.getElementById("make-call").onclick = () => {
  const theirID = document.getElementById('their-id').value;
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
var theirVideo;
var w = 640;
var h = 512;
var button;
var button2;
var button3;
var button4;
var sendButton5;
var textTheirId;
var inp;
var myId;

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
  createCanvas(320, 260);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();

  //相手の音声をミュート、アンミュート
  button = createButton('click m');
  button.position(20, 20);
  button.mousePressed(changeBG);

  button2 = createButton('click um');
  button2.position(20, 50);
  button2.mousePressed(changeBG2);

  //自分の音声をミュート、アンミュート
  button3 = createButton('click m');
  button3.position(100, 20);
  button3.mousePressed(changeBG3);

  button4 = createButton('click um');
  button4.position(100, 50);
  button4.mousePressed(changeBG4);

  textTheirId = createInput('ID');
}

function draw() { 
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);

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
}

function changeBG() {
  let video = document.getElementById('their-video');
  video.muted = true;
}

function changeBG2() {
  let video = document.getElementById('their-video');
  video.muted = false;
}

function changeBG3() {
  localStream.getAudioTracks()[0].enabled = false;
}

function changeBG4() {
  localStream.getAudioTracks()[0].enabled = true;
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