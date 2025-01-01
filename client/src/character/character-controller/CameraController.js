import camera from "../../env/Camera.js";

class CameraController {
  setUser(user) {
    this.user = user;
    this.user.camera = this;
    this.target = new THREE.Vector3();
    this.types = {
      tpp: this.tpp.bind(this), //far
      spp: this.spp.bind(this), //near
    };
    this.type = this.types.tpp;
    this.flag = false;
    this.isRun = true;
  }

  swticher(event) {
    if (event[0] == 9 && event[1]) {
      //tab
      this.flag = !this.flag;
      this.type = !this.flag ? this.types.tpp : this.types.spp;
    }
  }

  run() {
    if (this.user.obtacle && !this.isRun) return;
    this.type();
  }

  tpp() {
    camera.position.x = this.user.mesh.position.x - 0;
    camera.position.z = this.user.mesh.position.z - 6;
    camera.position.y = this.user.mesh.position.y + 5;
    this.target.set(
      this.user.mesh.position.x,
      this.user.mesh.position.y + 1,
      this.user.mesh.position.z
    );
    if (this.isRun) camera.lookAt(this.target);
  }

  spp() {
    camera.position.x = this.user.mesh.position.x - 1;
    camera.position.z = this.user.mesh.position.z - 2;
    camera.position.y = this.user.mesh.position.y + 2.8;
    this.target.set(
      this.user.mesh.position.x - 1,
      this.user.mesh.position.y + 1.5,
      this.user.mesh.position.z
    );
    camera.lookAt(this.target);
  }

  start() {
    this.user.eventEmitter.subscribe("keyListener", this.swticher.bind(this));
  }

  stop() {
    this.isRun = false;
    this.user.eventEmitter.unSubscribe("keyListener", this.swticher.bind(this));
  }
}

const cameraController = new CameraController();
export default cameraController;
