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

function preload() {
  birdImg = loadImage('assets/grumpy-bird.png')
  song = loadSound('assets/2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3')
}

var socket; //创建一个 socket 对象
function setup() {
  let canvas = createCanvas(640, 480) 
  canvas.parent('sketch-container')
  //新建一个socket连接到server
  socket = io.connect('http://localhost:3000'); 
  //开启监听start事件
  socket.on('startGame', function (isClicked) {
    console.log('start received', isClicked);
    isGameOver = !isClicked; 
    print('isGameOver',isGameOver)
  })
  bird = new Bird() //create a new bird
  pipes.push(new Pipe())
}

function draw() {
  if (!isGameOver){ //isGameOver == false
  background('#70c5ce')
  // Loop through each pipe
  for (let i = pipes.length - 1; i >= 0; i--) {
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
    textSize(64);
    text(score, 320, 240, 140, 160);
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

function refresh(){
  isGameOver = true
  isCountingDown = false
}
