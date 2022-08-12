/**
 * Initialize Handsfree.js and display feedback
 */
let handsfree = new Handsfree({
  posenet: true,
  feedback: {
    enabled: true,
    //$target: document.querySelector('#debugger')
    $target: document.querySelector('#sketch-container')
  }
})

/**
 * Handle flapping
 */
let hasFlappedUp = false
const ctx = handsfree.feedback.$debug.getContext('2d')
handsfree.use('flap', {
  onFrame (data) {
    const pose = data.posenet.pose
    if (!pose) return
    // Detect up flap
    if (
      pose.keypoints[9].position.y < pose.keypoints[5].position.y + 100 &&
      pose.keypoints[10].position.y < pose.keypoints[6].position.y + 100
    ) {
      hasFlappedUp = true
    }
    // Detect down flap
    if (
      hasFlappedUp &&
      pose.keypoints[9].position.y > pose.keypoints[5].position.y + 100 &&
      pose.keypoints[10].position.y > pose.keypoints[6].position.y + 100
    ) {
      hasFlappedUp = false
      bird.flap()
    }
    // Draw Debug info
    ctx.clearRect(0, 0, handsfree.feedback.$debug.width, handsfree.feedback.$debug.height)
    ctx.fillStyle = '#ff0'
    pose.keypoints.forEach(point => {
      if (point.score > .2) {
        ctx.beginPath()
        ctx.arc(point.position.x, point.position.y, 20, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fill()
      }
    })
  }
})

/**
 * Flap with spacebar
 */
function keyPressed() {
  if (key === ' ') {
    bird.flap()
    console.log('spacebar')
    playSong()
  }
}


document.querySelector('#update-nickname').addEventListener('click', () => {
  // $message.innerHTML = 'Loading PoseNet'
  playSong()
  handsfree.start()
  // document.querySelector('#button-wrap').style.display = 'none'
})