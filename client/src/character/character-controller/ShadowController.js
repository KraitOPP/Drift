import { directionalLight } from "../../env/Light.js";
import scene from "../../env/Scene.js";

class ShadowController {
  setUser(user) {
    this.user = user;
    scene.add(directionalLight.target);
  }

  run() {
    directionalLight.position.set(
      this.user.mesh.position.x + 5,
      this.user.mesh.position.y + 5,
      this.user.mesh.position.z - 2
    );
    directionalLight.target.position.set(
      this.user.mesh.position.x,
      this.user.mesh.position.y,
      this.user.mesh.position.z
    );
    directionalLight.target.updateMatrixWorld();
  }
}
export default ShadowController;
