let score = 0
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

function preload() {
  birdImg = loadImage('assets/grumpy-bird.png')
  song = loadSound('assets/2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3')
}

var socket; //创建一个 socket 对象
function setup() {
  let canvas = createCanvas(700, 480) 
  canvas.parent('sketch-container')
  //新建一个socket连接到server
  //socket = io.connect('http://localhost:3000'); 
  socket = io.connect('https://multiplayer-handsfree-flappy-b.herokuapp.com/');
  //开启监听start事件
  socket.on('startGame', function (isClicked) {
    console.log('start received', isClicked);
    isGameOver = !isClicked; 
    startCountdown = Boolean(isClicked);
  })
  bird = new Bird() //create a new bird
  pipes.push(new Pipe())
  textAlign(CENTER, CENTER);
  textSize(32);
  setInterval(timeIt, 1000);
}

function draw(){
  if (!isGameOver){
    if (startCountdown){ //倒计时5s
      background(220);
      textSize(32);
      text('step away from the screen'+'\n'+'spread your arms', width/2, height/2+70)
      textSize(100);
      if (timerValue > 0){
        text(timerValue, width/2, height/2);
      }else{
        text('Start!!!!', width/2, height/2+15);
        setTimeout(()=>{
          console.log('🔥ready to start!')
          startCountdown = false
        }, 1500)
      }
    }else{ //开始游戏
      background('#70c5ce')
      // Loop through each pipe
      for (let i = pipes.length - 6; i >= 0; i--) {
        if (isGameOver) {
          pipes[i].draw()
        } else {
          pipes[i].update()
        }
        // Delete when offscreen
        if (pipes[i].isOffscreen()) {
          pipes.splice(i, 1)
        }
      }
      // Create a new pipe in a fixed frequency
      if (frameCount % 75 === 0 && !isGameOver) {
        pipes.push(new Pipe())
      }
      if (isGameOver) {
        bird.draw()
      } else {
        bird.update()
      }
      // Handle gameover restart
      if (isGameOver && !isCountingDown) { //游戏结束&结束计数
        console.log('gameover ~');
        //isCountingDown = true
        stopSong()
        background(200);
        text(score);
        //刷新
        setTimeout(()=>{
          refresh()
        }, 1000)

        // setTimeout(() => {
        //   playSong()
        //   $message.innerHTML = ''
        //   pipes = []
        //   bird.y = height / 2
        //   isCountingDown = false
        //   //isGameOver = false
        //   score = 0
        //   $score.innerHTML = '0'
        // }, 1000)
      }
    }
}
}

function timeIt() {
  if (timerValue > 0) {
    timerValue--;
  }
}

function refresh(){
  isGameOver = true
  isCountingDown = false
}

function playSong() {
  if (!isSongPlaying) {
    isSongPlaying = true
    song.play()
  }
}

function stopSong() {
  isSongPlaying = false
  song.stop()
}