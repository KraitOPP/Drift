import CameraController from "./CameraController.js";
import machine from "../../env/LoopMachine.js";
import DisplacementController from "./DisplacementController.js";
import InputController from "./InputController.js";
import AnimationController from "./AnimationController.js";
import RotationController from "./RotationController.js";
import { EventEmitter } from "../../env/EventEmitter.js";
import ShadowController from "./ShadowController.js";

class CharacterController {
  constructor(mesh) {
    this.mesh = mesh;
    this.meshes = [];
    this.flag = false;
    this.eventEmitter = new EventEmitter();
    this.meshes.push(new InputController());
    this.meshes.push(new AnimationController());
    this.meshes.push(new DisplacementController());
    this.meshes.push(new RotationController());
    this.meshes.push(CameraController);
    this.meshes.push(new ShadowController());
  }

  run() {
    if (!this.flag) return;
    this.meshes.forEach((component) => {
      component.run();
    });
  }

  start() {
    if (this.flag) return;
    this.flag = true;
    this.meshes.forEach((component) => {
      component.setUser(this);
    });
    this.meshes.forEach((component) => {
      if (component.start) {
        component.start();
      }
    });
    machine.addCallback(this.run.bind(this));
  }

  stop() {
    this.flag = false;
    machine.removeCallback(this.run.bind(this));
    this.meshes.forEach((component) => {
      if (component.stop) component.stop();
    });
  }
}
export default CharacterController;
