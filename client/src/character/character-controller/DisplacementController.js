import eventEmitter from "../../env/EventEmitter.js";

class DisplacementController {
  setUser(user) {
    this.user = user;
    this.coord = new THREE.Vector2();
    this.speedRef = 1.5;
    this.speed = this.speedRef;
    this.clock = new THREE.Clock();
    this.timer = new Date().getTime();
    this.isJumping = false;
    this.center = new THREE.Vector3();
    this.rdi = 45;
  }

  run() {
    const delta = this.clock.getDelta();
    this.resetTimer();
    if (this.isJumping) return;
    if (this.timer + 200 > new Date().getTime()) return;
    // this.coord.set(-this.user.x, this.user.y).normalize()
    this.coord.set(
      Math.sin(this.user.mesh.rotation.y),
      Math.cos(this.user.mesh.rotation.y)
    );
    this.user.mesh.position.x += this.coord.x * this.speed * delta;
    this.user.mesh.position.z += this.coord.y * this.speed * delta;
    if (!this.radioEdge()) return;
    this.user.mesh.position.x -= this.coord.x * this.speed * delta * 1.5;
    this.user.mesh.position.z -= this.coord.y * this.speed * delta * 1.5;
  }

  radioEdge() {
    if (this.user.obtacle) return true;
    return this.user.mesh.position.distanceTo(this.center) > this.rdi;
  }

  resetTimer() {
    if ((this.user.x == 0 && this.user.y == 0) || this.isJumping)
      this.timer = new Date().getTime();
  }

  keyListener(data) {
    if (data[0] == 16) {
      this.speed = data[1] ? this.speedRef * 2 : this.speedRef;
    }
  }

  jumping(flag) {
    this.isJumping = flag;
  }

  start() {
    eventEmitter.subscribe("keyListener", this.keyListener.bind(this));
    this.user.eventEmitter.subscribe("jumping", this.jumping.bind(this));
  }

  stop() {
    eventEmitter.unSubscribe("keyListener", this.keyListener.bind(this));
  }
}

export default DisplacementController;
