import eventEmitter from "../../env/EventEmitter.js";
import keyListener from "../../env/KeyListener.js";

class InputController {
  setUser(user) {
    this.user = user;
    this.user.x = 0;
    this.user.y = 0;
    this.isJumping = false;
  }

  run() {
    this.user.x = 0;
    this.user.y = 0;
    if (this.isJumping) return;
    if (keyListener.isPressed(65)) this.user.x -= 1;
    if (keyListener.isPressed(68)) this.user.x += 1;
    if (keyListener.isPressed(87)) this.user.y += 1;
    if (keyListener.isPressed(83)) this.user.y -= 1;
  }

  jumping(flag) {
    this.isJumping = flag;
  }

  dispatchKeys(data) {
    this.user.eventEmitter.dispatch("keyListener", data);
  }

  start() {
    this.user.eventEmitter.subscribe("jumping", this.jumping.bind(this));
    eventEmitter.subscribe("keyListener", this.dispatchKeys.bind(this));
  }

  stop() {
    this.user.eventEmitter.unSubscribe("jumping", this.jumping.bind(this));
    eventEmitter.unSubscribe("keyListener", this.dispatchKeys.bind(this));
  }
}

export default InputController;
