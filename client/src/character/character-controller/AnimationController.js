import keyListener from "../../env/KeyListener.js";
import AnimatorModeAdapter from "./AnimatorModeAdapter.js";

class AnimationController {
  setUser(user) {
    this.user = user;
    this.adapter = new AnimatorModeAdapter(
      this.user.mesh,
      this.user.mesh.modes
    );
    this.isJumping = false;
  }

  run() {
    if (this.user.obtacle) return;
    if (!this.adapter.animator.inProgress && this.isJumping) {
      this.isJumping = false;
      this.jumping(this.isJumping);
    }
    if (keyListener.isPressed(32) && !this.isJumping) {
      this.adapter.setMode("normal");
      this.adapter.run("jump");
      this.isJumping = true;
      this.jumping(this.isJumping);
    } else {
      if (this.user.x != 0 || this.user.y != 0) this.adapter.run("ahead");
      if (this.user.x == 0 && this.user.y == 0) this.adapter.run("idle");
    }
  }

  jumping(set) {
    this.user.eventEmitter.dispatch("jumping", set);
  }

  keyListener(event) {
    if (event[0] == 16) {
      //shift
      this.adapter.setMode(event[1] ? "run" : "normal");
    }
  }

  start() {
    this.adapter.start();
    this.user.eventEmitter.subscribe("keyListener", this.keyListener.bind(this));
  }

  stop() {
    this.adapter.stop();
    this.user.eventEmitter.unSubscribe("keyListener", this.keyListener.bind(this));
  }
}
export default AnimationController;
