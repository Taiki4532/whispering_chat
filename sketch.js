var capture;
var w = 1280;
var h = 1024;
var button;
var inp;
var myId;

function setup() {
  createCanvas(1280,1024);

  capture = createCapture({
    audio: true,
    video: false
  });
  capture.elt.setAttribute('autoplay','playsinline', '');
  capture.size(160, 120);
  capture.hide();

  let peer = new Peer({
    key: 'db12c4f5-2b65-411c-8e39-cd36386150cf',
  });

  peer.on("open", () => {
    console.log("open! id=" + peer.id);
    createP("Your id: " + peer.id);
});
 inp = createInput('');
  //inp.position(w/2,h/3);

  button = createButton("call").mousePressed(() => {
    // ボタンが押されたら
    const callId = inp.value(); //id入力欄の値を取得
    console.log("call! id=" + peer.id);
    const call = peer.call(callId, capture.elt.srcObject); 

  });
 //button.position(w/2,h/2);
 peer.on("call", (call) => {
  console.log("be called!");
  call.answer(capture.elt.srcObject); //呼び出し相手に対して返す
  var audioElm;
  audioElm.srcObject = call;
  audioElm.play();
});
}

// let localStream = capture;

//    const peer = new Peer({      
//     key: 'db12c4f5-2b65-411c-8e39-cd36386150cf',
//     debug: 3
//     });

//     peer.on('open', () => {
//       myId = peer.id;
//     });
 
// function callToSomeone(){
//   const theirID = inp.value;
//   const mediaConnection = peer.call(theirID, localStream);
//   setEventListener(mediaConnection);
// }

// const setEventListener = mediaConnection => {
//   mediaConnection.on('stream', stream => {
//     // video要素にカメラ映像をセットして再生
//     const videoElm = document.getElementById('their-video')
//     videoElm.srcObject = stream;
//     videoElm.play();
//   });
// }

// //着信処理
// peer.on('call', mediaConnection => {
//   mediaConnection.answer(localStream);
//   setEventListener(mediaConnection);
// });

function draw() { 
  background(0);
  ellipse(w/2,h/2,100,100);
}