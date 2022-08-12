let score = 0;
let $score = document.querySelector('#score')
let bird
let pipes = []
//let isGameOver = false
let isGameOver = true
let birdImg
let isCountingDown = false
let gameOverCountdown = 0
let $message = document.querySelector('#message')
let posenet
let video
let song
let isSongPlaying = false
let timerValue = 10
let startCountdown = false
// let play = false


function preload() {
  birdImg = loadImage('assets/grumpy-bird.png')
  song = loadSound('assets/2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3')
  //创建camera
  video = createCapture(VIDEO, () => {
		video.size(windowHeight*1.78, windowHeight);
		video.hide();
	});
}

var socket; //创建一个 socket 对象
function setup() {
  let canvas = createCanvas(windowHeight*1.78, windowHeight); 
  canvas.parent('sketch-container')

  //生成鸟和管道
  bird = new Bird() //create a new bird
  pipes.push(new Pipe())
  textAlign(CENTER, CENTER);
  textSize(32);
  setInterval(timeIt, 1000);

  //监听按钮控制游戏开始
  document.querySelector('#update-nickname').addEventListener('click', () => { //按下按钮后连接到server  
    //1.连接到server
    socket = io.connect('http://localhost:3000'); 
    //socket = io.connect('https://webcam-food-rain.herokuapp.com/');
    username = document.querySelector('#nickname-input').value;
    console.log('username: ',username);
    //2.开启控制
    console.log('handsfree start!!!!!!!');
    isGameOver = false;
    startCountdown = true;
  })
}


function draw() {
  image(video, 0, 0, width, width * video.height / video.width);
  for (let i = pipes.length - 8; i >= 0; i--) {
    if (isGameOver) {
      pipes[i].draw()
    } else {
      pipes[i].update()
      //更新分数
      $score = document.querySelector('#score')
      socket.emit('updateScore', score, username); 
      console.log(score, username);
    }
    // Delete when offscreen
    if (pipes[i].isOffscreen()) {
      pipes.splice(i, 1)
    }
  }
  // Create a new pipe
  if (frameCount % 75 === 0 && !isGameOver) {
    pipes.push(new Pipe())
  }
  if (isGameOver) {
    bird.draw()
  } else {
    bird.update()
  }
}


function timeIt() {
  if (timerValue > 0) {
    timerValue--;
  }
}

function refresh(){
  isGameOver = true;
  isCountingDown = false;
}

function playSong() {
  if (!isSongPlaying) {
    isSongPlaying = true;
    song.play();
  }
}

function stopSong() {
  isSongPlaying = false;
  song.stop();
}


// let scoreList = 0;
// let $scoreList = document.querySelector('#score-list');
socket.on('displayScore', function (scores) {
  sortLeaderboard(scores);
})

//let scoreLabel = document.getElementById("score-label");
let topScoreLabel = document.getElementById("top-label");
let scoreList = document.getElementById("score-list");
function sortLeaderboard(scores){
  //scoreLabel.innerHTML = "Score: " + myScore;
  let listItems = "";
  scores.forEach((bird) => {
    if(bird.username != ''){
      listItems +=
      "<li class='score-item'><span class='name'>" +
      bird.username +
      "</span><span class='points'>" +
      bird.score +
      "pts</span></li>";
    }
  });
  scoreList.innerHTML = listItems;
}

