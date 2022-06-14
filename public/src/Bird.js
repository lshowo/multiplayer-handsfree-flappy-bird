class Bird {
  constructor() {
    // the bird's initial position(x, y)
    this.x = 64
    this.y = height / 2
    this.width = 32
    this.gravity = 0.5 //g
    this.lift = -16 //a
    this.liftFromGround = -12
    this.velocity = 0 //v
  }

  //change the position of the bird
  draw() { 
    // fill(255)
    // ellipse(this.x, this.y, this.width, this.width)
    image(birdImg, this.x - 30, this.y - 30)
  }

  //
  flap() {
    if (this.velocity === 0) {
      this.velocity = this.liftFromGround
    } else {
      this.velocity += this.lift
    }
  }

  update() {
    this.velocity += this.gravity //v += 1(flap) * g
    this.y += this.velocity // y += 1(flap)* v
    //if the bird fall/fly off the screen
    if (this.y < 0) { 
      this.y = 0
      this.velocity = 0
    }
    if (this.y > height) {
      this.y = height
      this.velocity = 0
    }

    this.draw()
  }
}
