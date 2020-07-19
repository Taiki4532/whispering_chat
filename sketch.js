var capture;
var w = 640;
var h = 512;
var button;
var inp;
var myId;

function setup() {
  createCanvas(640,480);
  capture = createCapture({
    audio: true,
    video: {
      width:320,height:240
    }
  });
  capture.elt.setAttribute('autoplay','playsinline', '');
  capture.size(260, 120);
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
    const callId = inp.value(); 
    console.log("call! id=" + peer.id);
    var options = {
      'constraints': {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      }
    }
    const call = peer.call(callId, capture.elt.srcObject,options); 
    addVideo(call);
  });
 //button.position(w/2,h/2);

 peer.on("call", (call)  => {
  console.log("be called!");
  var options = {
    'constraints': {
      offerToReceiveAudio: true,
      offerToReceiveVideo: false
    }
  }
  call.answer(capture.elt.srcObject,options); //呼び出し相手に対して返す
  addVideo(call);
});
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
}


function draw() { 
  background(0);
  ellipse(w/2,h/2,100,100);
}