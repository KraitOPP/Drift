import scene from "../../env/Scene.js";

class User {
  constructor() {
    this.resolve = null;
    this.mesh = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
    });
  }

  setUser(mesh) {
    if (this.mesh) {
      scene.remove(this.mesh);
    }
    this.mesh = mesh;
    this.resolve(mesh);
  }

  getUser() {
    return this.mesh;
  }

  getPromise() {
    return this.promise;
  }
}

const player = new User();

export default player;
