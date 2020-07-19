var socket;

var smile = [1.6509927122924517,0.3640226259023722,0.7090326236989825];
var angry = [1.5173075196839985,0.02341986974754432,0.6784736837533991];
var surprise = [1.2796265250131034,0.5252423636880603,0.9023158892168012];
var neutral = [1.291783978928102,0.0735014078883618,0.6975458586542724];

var mouth_openness;
var mouth_width;
var eyebrow_height;

var capture;
var tracker;
var w = 640;
var h = 480;

let button;
let buttonText;
let anoFaceMode;

function setup() {

  capture = createCapture({
    audio: false,
    video: {
      width: w,
      height: h
    }
  });
  capture.elt.setAttribute('playsinline', '');

  createCanvas(w*3/2, h);
  capture.size(w, h);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  socket = io.connect('https://facial-expression-5500.herokuapp.com/'); 
  socket.on('expressiondata', gotData);

  buttonText = "Change mode";
  button = createButton(buttonText);
  button.position(w*5/4,h*11/12);
  button.mousePressed(changeMode);
  anoFaceMode = false;
}
 
var oppAng;
var oppSmi;
// var oppSur;
var oppNeu;
var oppPos;
var oppCheck = 0;
var oppDa;
var oppDs;
var oppDn;

var trackChecker;


function draw() {
  resetMatrix();
  background(30);
  image(capture, 0, 0, w, h);
  var positions = tracker.getCurrentPosition();
  trackChecker = 0;

  if (positions.length > 0) {
    trackChecker = 1;
    var mouthLeft = createVector(positions[44][0], positions[44][1]);
    var mouthRight = createVector(positions[50][0], positions[50][1]);

    var right_megashira = createVector(positions[25][0], positions[25][1]);
    var left_megashira = createVector(positions[30][0], positions[30][1]);
    var dist_megashira = right_megashira.dist(left_megashira);
    mouth_width = mouthLeft.dist(mouthRight) / dist_megashira;

    var left_eyebrow_height = dist(positions[16][0],positions[16][1],positions[32][0],positions[32][1])
    var right_eyebrow_height = dist(positions[20][0],positions[20][1],positions[27][0],positions[27][1]);
    eyebrow_height = (left_eyebrow_height + right_eyebrow_height) / 2;
    eyebrow_height = eyebrow_height / dist_megashira;

    mouth_openness = dist(positions[60][0], positions[60][1],positions[57][0], positions[57][1]);
    mouth_openness = mouth_openness / dist_megashira;

    var dist_smile = dist(smile[0], smile[1], smile[2],mouth_width, mouth_openness, eyebrow_height)*10;
    //var dist_surprise = dist(surprise[0], surprise[1], surprise[2],mouth_width, mouth_openness, eyebrow_height);
    var dist_angry = dist(angry[0], angry[1], angry[2],mouth_width, mouth_openness, eyebrow_height)*10;
    var dist_neutral = dist(neutral[0], neutral[1], neutral[2],mouth_width, mouth_openness, eyebrow_height)*10;

    //var total = (dist_angry + dist_smile + dist_surprise)*2;
    //var total = (dist_angry + dist_smile + dist_neutral)*2;
    //var total = (dist_angry + dist_smile + dist_surprise + dist_neutral)*3;

    var angS = dist_neutral + dist_smile;
    var smiS = dist_angry + dist_neutral;
    var neuS = dist_angry + dist_smile;
    // var surS = dist_smile + dist_angry;
    // var angS = dist_surprise + dist_neutral + dist_smile;
    // var smiS = dist_angry + dist_surprise + dist_neutral;
    // var surS = dist_smile + dist_angry + dist_neutral;
    //var neuS = dist_angry + dist_smile + dist_surprise;

    angS = pow(angS,3/2);
    smiS = pow(smiS,3/2);
    neuS = pow(neuS,3/2);

    var total = angS + smiS + neuS;

     var angry_percent = angS/total;
     var smile_percent = smiS/total; 
    //  var surprise_percent = surS/total;
    var neutral_percent = neuS/total;

    var angry_radian = TWO_PI*angry_percent;
    var smile_radian = TWO_PI*smile_percent;
    // var surprise_radian = TWO_PI*surprise_percent;
    var neutral_radian = TWO_PI*neutral_percent;

    var angry_100 = int(angry_percent*100);
    var smile_100 = int(smile_percent*100);
    // var surprise_100 = int(surprise_percent*100);
    var neutral_100 = int(neutral_percent*100);

    // noStroke();
    // fill(30);
    // rect(w,0,w*3/2,h/2);

    noFill();
    stroke(255);
    textAlign(CENTER);
    text("Yours",w*5/4,h/12);
    textAlign(LEFT);
    stroke(255,0,0);
    text("angry : "+angry_100+"%",w*21/16,h*2/12);
    stroke(255,225,0);
    text("smile : "+smile_100+"%",w*21/16,h*3/12);
    stroke(0,50,255);
    // text("surprise"+surprise_100+"%",w*21/16,h*4/12);
    // stroke(255,255,255);
    text("neutral : "+neutral_100+"%",w*21/16,h*4/12);

    translate(w*37/32,h*3/12);
    rotate(-HALF_PI);

    noStroke();
    fill(255,0,0);
    arc(0,0,w/5,w/5,0,angry_radian);
    fill(255,225,0);
    arc(0,0,w/5,w/5,angry_radian,angry_radian+smile_radian);
    fill(0,50,255);
    // arc(0,0,w/5,w/5,angry_radian+smile_radian,angry_radian+smile_radian+surprise_radian);
    arc(0,0,w/5,w/5,angry_radian+smile_radian,angry_radian+smile_radian+neutral_radian);
    // fill(255,255,255);
    // arc(0,0,w/5,w/5,angry_radian+smile_radian+surprise_radian,angry_radian+smile_radian+surprise_radian+neutral_radian);
    
    var expressiondata = {
      ang:angry_percent,
      smi:smile_percent,
      // sur:surprise_percent,
      neu:neutral_percent,
      // checker:trackChecker
      che:trackChecker,
      d_s:dist_smile,
      d_a:dist_angry,
      d_n:dist_neutral,
      pos:positions
    }
 
     socket.emit('expressiondata', expressiondata);
    }else{
      noFill();
      stroke(255);
      textAlign(CENTER);
      text("Your data is not available",w*5/4,h*3/12);
      textAlign(LEFT);
    }

   if(oppCheck == 1){
    drawPartnerGraph(); 
  }else if(oppCheck == 0){
    noFill();
    stroke(255);
    textAlign(CENTER);
    text("Partner's data is not available",w*5/4,h*9/12);
    textAlign(LEFT);
  }

  //oppCheck = 0;

}
    
function gotData(expressiondata){
  oppAng = expressiondata.ang;
  oppSmi = expressiondata.smi;
  // oppSur = expressiondata.sur;
  oppNeu = expressiondata.neu;
  oppCheck = expressiondata.che;
  oppPos = expressiondata.pos;
  // drawPartnerGraph()
  oppDa = expressiondata.d_a;
  oppDs = expressiondata.d_s;
  oppDn = expressiondata.d_n;
}

function drawPartnerGraph(){    
    if(anoFaceMode == false){
  resetMatrix();

    var o_angry_radian = TWO_PI*oppAng;
    var o_smile_radian = TWO_PI*oppSmi;
    // var o_surprise_radian = TWO_PI*oppSur;
    var o_neutral_radian = TWO_PI*oppNeu;

    var o_angry_100 = int(oppAng*100);
    var o_smile_100 = int(oppSmi*100);
    // var o_surprise_100 = int(oppSur*100);
    var o_neutral_100 = int(oppNeu*100);

    // noStroke();
    // fill(30);
    // rect(w,h/2,w*3/2,h);

    noFill();
    stroke(255);
    textAlign(CENTER);
    text("Partner",w*5/4,h*6/12);
    textAlign(LEFT);
    stroke(255,0,0);
    text("angry : "+o_angry_100+"%",w*21/16,h*8/12);
    stroke(255,225,0);
    text("smile : "+o_smile_100+"%",w*21/16,h*9/12);
    stroke(0,50,255);
    // text("surprise"+o_surprise_100+"%",w*21/16,h*10/12);
    // stroke(255,255,255);
    text("neutral"+o_neutral_100+"%",w*21/16,h*10/12);

    translate(w*37/32,h*9/12);
    rotate(-HALF_PI);

    noStroke();
    fill(255,0,0);
    arc(0,0,w/5,w/5,0,o_angry_radian);
    fill(255,225,0);
    arc(0,0,w/5,w/5,o_angry_radian,o_angry_radian+o_smile_radian);
    fill(0,50,255);
    arc(0,0,w/5,w/5,o_angry_radian+o_smile_radian,o_angry_radian+o_smile_radian+o_neutral_radian);
    }else{
    resetMatrix();

    var ave_eyeb = createVector((oppPos[17][0] + oppPos[32][0]) / 2, (oppPos[17][1] + oppPos[32][1]) / 2);
    var chin = createVector(oppPos[7][0], oppPos[7][1]);
    var d = ave_eyeb.dist(chin);

    var d_le = dist(oppPos[32][0],oppPos[32][1],oppPos[62][0],oppPos[62][1]);
    var d_re = dist(oppPos[27][0],oppPos[27][1],oppPos[62][0],oppPos[62][1]);
    var d_m = dist((oppPos[44][0] + oppPos[50][0]) / 2, (oppPos[44][1] + oppPos[50][1]) / 2,oppPos[62][0],oppPos[62][1]);
    var d_mw = dist(oppPos[44][0],oppPos[44][1],oppPos[50][0],oppPos[50][1])/2;

    var v_le = createVector(oppPos[32][0]-oppPos[62][0],oppPos[32][1]-oppPos[62][1]);
    var v_re = createVector(oppPos[27][0]-oppPos[62][0],oppPos[27][1]-oppPos[62][1]);
    var v_m = createVector((oppPos[44][0] + oppPos[50][0]) / 2-oppPos[62][0],(oppPos[44][1] + oppPos[50][1]) / 2 -oppPos[62][1]);

    var r_le = d_le/d;
    var r_re = d_re/d;
    var r_m = d_m/d;
    var r_mw = d_mw/d;

    translate(w*5/4,h*9/12);

    fill(255);
    stroke(0);
    strokeWeight(3);
    ellipse(0,0,w/4,w/4);
    ellipse(v_le.x*w/d/5,v_le.y*w/d/5,w/24,w/24);
    ellipse(v_re.x*w/d/5,v_re.y*w/d/5,w/24,w/24);
    fill(0);
    ellipse(v_le.x*w/d/5,v_le.y*w/d/5,w/48,w/48);
    ellipse(v_re.x*w/d/5,v_re.y*w/d/5,w/48,w/48);
    if(oppDn < oppDs && oppDn < oppDa){
      line((v_m.x-d_mw)*w/d/5,v_m.y*w/d/5,(v_m.x+d_mw)*w/d/5,v_m.y*w/d/5);
    }else if(oppDs < oppDa && oppDs < oppDn){
      line((v_m.x-d_mw)*w/d/5,v_m.y*w/d/5,v_m.x*w/d/5,v_m.y*w/d/3.5);
      line(v_m.x*w/d/5,v_m.y*w/d/3.5,(v_m.x+d_mw)*w/d/5,v_m.y*w/d/5);
    }else if(oppDa < oppDs && oppDa < oppDn){
      line((v_m.x-d_mw)*w/d/5,v_m.y*w/d/5,v_m.x*w/d/5,v_m.y*w/d/6.5);
      line(v_m.x*w/d/5,v_m.y*w/d/6.5,(v_m.x+d_mw)*w/d/5,v_m.y*w/d/5);
    }

   }
   strokeWeight(1);
}

function changeMode(){
  anoFaceMode  = !anoFaceMode;
}