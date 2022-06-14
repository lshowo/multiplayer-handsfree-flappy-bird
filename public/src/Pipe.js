let pipeBorderWidth = 2 

class Pipe {
  constructor() {
    this.spacing = 250 //the space between toppipe and bottompipe
    this.top = random(height / 6, (3 / 4) * height) //the height of toppipe, its a random value
    this.bottom = height - (this.top + this.spacing) //the height of bottompipe
    this.x = width //theXposition of two pipes(every new pipe positioned at the right of the screen)
    this.width = 80 //the width of pipes
    this.speed = 7 //the move speed
    this.hasScored = false
  }

  update() {
    this.x -= this.speed
    //if the bird is passing a pair of pipes
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.width) {
        isGameOver = true
      }
    }
    this.checkIfHasScored() //update socre
    this.draw() //update canvas
  }

  checkIfHasScored() {
    if (bird.x > this.x + this.width / 2 && !this.hasScored) {
      score++
      this.hasScored = true
      $score.innerHTML = score
    }
  }

  isOffscreen() {
    if (this.x < -this.width) { //if the entire pipe is off the screen
      return true
    } else {
      return false
    }
  }

  draw() {
    strokeWeight(3)
    //draw the toppipe
    this.drawPipeCoverFill(this.top - pipeBorderWidth)
    this.drawPipe(-pipeBorderWidth, this.top)
    this.drawPipeCover(this.top - pipeBorderWidth)
    //draw the bottompipe
    this.drawPipeCoverFill(height - this.bottom + 40 - pipeBorderWidth)
    this.drawPipe(height - this.bottom, this.bottom + pipeBorderWidth)
    this.drawPipeCover(height - this.bottom + 40 - pipeBorderWidth)
  }

  // 3 functions drawing pipes
  drawPipe(top, bottom) {
    // base
    stroke('#543847')
    fill('#73bf2e') 
    rect(this.x, top - pipeBorderWidth, this.width, bottom + pipeBorderWidth)
    // Left shine
    fill('#9ce659')
    noStroke()
    rect(this.x + pipeBorderWidth, top + 2, this.width / 3, bottom - pipeBorderWidth - 2)
    // Left shine line
    stroke('#73bf2e')
    rect(this.x + pipeBorderWidth + 4, top + 2, 2, bottom - pipeBorderWidth - 3)
    fill('#558022')
    // Right shadow
    noStroke()
    rect(this.x + this.width - 20, top + 2, this.width / 3 - 10, bottom - pipeBorderWidth - 2)
    // Right shadow line
    fill('#73bf2e')
    rect(this.x + this.width - 5, top - pipeBorderWidth, 2, bottom - pipeBorderWidth)
  }

  drawPipeCover(top) { //the rectangle cover
    // base
    stroke('#543847')
    noFill()
    rect(this.x - 5, top - 40, this.width + 10, 40)
  }

  drawPipeCoverFill(top) {
    // base
    stroke('#543847')
    fill('#73bf2e')
    rect(this.x - 5, top - 40, this.width + 10, 40)
  }
}
