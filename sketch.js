let localStream = null;
let peer = null;
let constraints = {
  video:false,
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
  const mediaConnection = peer.call(theirID, localStream);
  setEventListener(mediaConnection);
};

// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    // video要素にカメラ映像をセットして再生
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
var inp;
var myId;

function setup() {
  createCanvas(640,480);

  

  /*capture = createCapture({
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

function addVideo(call){
  call.on("stream",(theirStream) => {
    console.log('stream!');
    theirVideo = createVideo();
    theirVideo.elt.autoPlay = true;
    theirVideo.elt.srcObject = theirStream;
    theirVideo.size(160, 120);
    theirVideo.play();
    theirVideo.hide();
  })*/



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


}

function draw() { 
  background(0);
  ellipse(w/2,h/2,100,100);
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